export function sortItems(arr) {
  var tree = [],
    mappedArr = {},
    arrElem,
    mappedElem;
  for (var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]['children'] = [];
  }
  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      if (mappedElem.parent) {
        mappedArr[mappedElem['parent']]['children'].push(mappedElem);
      }
      else {
        tree.push(mappedElem);
      }
    }
  }

  let result = [];
  tree.forEach(({children, ...rest}) => {
    result.push(rest);
    if(children) this.flattenArray(children, result)
  });

  return result;
}

export function flattenArray(a, r) {
  a.forEach(({children, ...rest}) => {
    r.push(rest);
    if(children) this.flattenArray(children, r)
  });
}