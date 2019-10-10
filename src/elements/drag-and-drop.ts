import { sortItems } from './tree-helpers';

export class DragAndDrop {
  public formName: string = '';
  public formParent: string = '';
  public departments: IDepartment[] = [
    { id: 1, name: 'Department A', parent: null },
    { id: 2, name: 'Department B', parent: null },
    { id: 3, name: 'Department C', parent: 1 },
    { id: 4, name: 'Department D', parent: 3 },
    { id: 5, name: 'Department E', parent: 4 },
    { id: 6, name: 'Department F', parent: 4 },
    { id: 7, name: 'Department G', parent: 3 },
    { id: 8, name: 'Department H', parent: 2 }
  ];

  public draggedItem: string;

  public attached(): void {
    this.populateTree();
    this.setupEventListeners();
  }

  public addDepartment(): void {
    let max = 0;
    this.departments.forEach(department => {
      if (department.id > max) {
        max = department.id;
      }
    });
    if (this.formParent !== '') {
      const parent = this.departments.find(x => x.name === this.formParent)
      if (!!parent) {
        this.departments.push({
          id: max + 1,
          name: this.formName,
          parent: parent.id
        })
      }
    } else {
      this.departments.push({
        id: max + 1,
        name: this.formName,
        parent: null
      })
    }
    this.formName = '';
    this.formParent = '';
    this.populateTree();
  }

  public populateTree(): void {
    this.departments = sortItems(this.departments);
    var tree = document.getElementById("tree");
    while (tree.firstChild) {
      tree.removeChild(tree.firstChild);
    }
    for (var i = 0; i < this.departments.length; ++i) {

      if (this.departments[i].parent == null) {
        this.createTreeElement("li", this.departments[i].id, this.departments[i].name, tree);
      }
      else {
        var treeChildNode = document.getElementById("t" + this.departments[i].parent).getElementsByTagName("ul");
        if (treeChildNode.length) {
          this.createTreeElement("li", this.departments[i].id, this.departments[i].name, treeChildNode[0]);
        }
        else {
          this.createTreeElement("ul", this.departments[i].parent, "", document.getElementById("t" + this.departments[i].parent));
          this.createTreeElement("li", this.departments[i].id, this.departments[i].name, document.getElementById("t" + this.departments[i].parent).getElementsByTagName("ul")[0]);
        }

      }
    }
  }

  public createTreeElement(name, id, text, parent) {
    var node = (document.createElement(name) as Element);
    const itemId = "t" + id;
    let nodeHtml = text;
    if (name === 'li') {
      node.setAttribute('draggable', 'true')
      nodeHtml = `<div class="item-name" id="${itemId}" + id">${text}</div>`
    }
    node.id = itemId;
    node.innerHTML = nodeHtml;
    parent.appendChild(node);
  }

  public setupEventListeners(): void {
    document.addEventListener('drop', (event) => {
      event.preventDefault();
      const droppedAtItem = (event.target as any).id.replace('t', '');
      const currentDragItem = this.departments.find(x => x.id.toString() === this.draggedItem);
      if (this.draggedItem !== droppedAtItem) {
        currentDragItem.parent = parseInt(droppedAtItem);
        this.populateTree();
      }
    }, false);
    document.addEventListener('drag', (event) => {
      this.draggedItem = (event.target as any).id.replace('t', '');
    }, false)
    document.addEventListener("dragover", (event) => {
      event.preventDefault();
    }, false);
  }
}

export interface IDepartment {
  id: number;
  name: string;
  parent: number;
}
