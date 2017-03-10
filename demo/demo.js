/* eslint-disable */
import Viewer from '../main';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';
import tsLocaleData from 'react-intl/locale-data/ts';
import BookmarkListDemo from '../main.js'; // eslint-disable-line no-unused-vars

const localeData = {
  en: enLocaleData,
  fr: frLocaleData,
  ts: tsLocaleData
};
function getParam(item) {
  const svalue = location.search.match(new RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i'));
  return svalue ? svalue[1] : svalue;
 }

function clientCallback() {
  alert("client callback");
}

function viewerLoaded() {
  alert("Viewer Loaded");
}

function init() {
  const region = getParam('lang') || 'en';
  addLocaleData(localeData[region]);

  new Viewer({
    elementId: 'viewer-container',
    locale: region,
    data: {
      currentPageId: 'abc123',
      pages: [
        { id: 'abc123', title: 'Title of Page 1', 'content': '<html>Hello World! This is Page 1.</html>' },
        { id: 'abc124', title: 'Title of Page 2', 'content': '<html>Hello World! This is Page 2.</html>' },
        { id: 'abc125', title: 'Title of Page 3', 'content': '<html>Hello World! This is Page 3.</html>' }
      ]
    },
    goToPageCallback: clientCallback,
    viewerLoaded: viewerLoaded
  });
}

window.onload = init;
/* eslint-enable */
