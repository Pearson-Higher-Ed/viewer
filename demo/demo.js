import Viewer from '../main';

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function init() {
  const locale = getParameterByName('locale');

  new Viewer({
    elementId: 'viewer-container',
    locale: locale,
    data: {
      currentPageId: 'abc123',
      pages: [
        { id:'abc123', title: 'Title of Page 1', 'content': '<html>Hello World! This is Page 1.</html>' },
        { id:'abc124', title: 'Title of Page 2', 'content': '<html>Hello World! This is Page 2.</html>' },
        { id:'abc125', title: 'Title of Page 3', 'content': '<html>Hello World! This is Page 3.</html>' }
      ]
    }
  });
}

window.onload = init;
