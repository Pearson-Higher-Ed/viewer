import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';
import itLocaleData from 'react-intl/locale-data/it';
import nlLocaleData from 'react-intl/locale-data/nl';
import './main.scss';
import ComponentOwner from './src/js/component-owner';
import InternationalSupport from './src/js/InternationalSupport';

/* eslint-disable */
export default class ViewerDemo {
  constructor(config) {
    addLocaleData(frLocaleData);
    addLocaleData(itLocaleData);
    addLocaleData(nlLocaleData);
    this.init(config);
  }

  init(config) {
    this.intlObj = new InternationalSupport(config.locale);

    ReactDOM.render( 
      <IntlProvider locale={this.intlObj.getLocale()} messages={this.intlObj.getMessages()}>
        <ComponentOwner data={config.data} goToPageCallback={config.goToPageCallback} viewerLoaded={config.viewerLoaded}/> 
      </IntlProvider> ,
      document.getElementById(config.elementId)
    );
  }
}
/* eslint-enable */
export ViewerComponent from './src/js/ViewerComponent';

// Listen for client events to initialize a new Viewer component
document.body.addEventListener('o.InitViewer', e => new ViewerDemo(e.detail));
