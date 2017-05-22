import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import { InternationalSupport } from '@pearson-incubator/aquila-js-core';
import frLocaleData from 'react-intl/locale-data/fr';
import itLocaleData from 'react-intl/locale-data/it';
import nlLocaleData from 'react-intl/locale-data/nl';
import './main.scss';
import ComponentOwner from './src/js/component-owner';
import msgObject from './translations';

export default class ViewerDemo {
  constructor(config) {
    addLocaleData(frLocaleData);
    addLocaleData(itLocaleData);
    addLocaleData(nlLocaleData);
    this.init(config);
  }

  init(config) {
    this.intlObj = new InternationalSupport(msgObject, config.locale);
    ReactDOM.render(
      <IntlProvider locale={this.intlObj.getLocale()} messages={this.intlObj.getMessages()}>
        <ComponentOwner
          data={config.data}
          goToPageCallback={config.goToPageCallback}
          isET1={config.isET1}
          viewerLoaded={config.viewerLoaded}
          getPrevNextPage={config.getPrevNextPage}
          callbackParent={config.callbackParent}
        />
      </IntlProvider>,
      document.getElementById(config.elementId)
    );
  }
}
/* eslint-enable */
export { ViewerComponent } from './src/js/ViewerComponent';

// Listen for client events to initialize a new Viewer component
document.body.addEventListener('o.InitViewer', e => new ViewerDemo(e.detail));
