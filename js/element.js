function createElement( type, classNames = [], ...children) {
    const element = document.createElement(type);
    element.classList.add(...classNames);
    element.append(...children);
    return element;
 }

 function createImgElement ( path, description = '', classNames = []) {
    const img = createElement('img', classNames);
    img.src = path;
    img.setAttribute('alt', description);
    return img
 }

 export {createElement, createImgElement}

