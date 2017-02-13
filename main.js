import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';
import itLocaleData from 'react-intl/locale-data/it';
import nlLocaleData from 'react-intl/locale-data/nl';
import frJson from './translations/fr.json';
import itJson from './translations/it.json';
import nlJson from './translations/nl.json';
import './main.scss';
import ComponentOwner from './src/js/component-owner';

const translations = {
  fr: frJson,
  it: itJson,
  nl: nlJson
};
/* eslint-disable */
export default class ViewerComponent {
  constructor(config) {
    addLocaleData(frLocaleData);
    addLocaleData(itLocaleData);
    addLocaleData(nlLocaleData);
    this.init(config);
  }

  init(config) {
    const locale = config.locale ? config.locale : 'en';

    ReactDOM.render( 
      <IntlProvider locale={locale} messages={translations[locale]}>
        <ComponentOwner data={config.data} goToPageCallback={config.goToPageCallback} viewerDidMount={config.viewerDidMount}/> 
      </IntlProvider> ,
      document.getElementById(config.elementId)
    );
  }
}
/* eslint-enable */
export Viewer from './src/js/Viewer';

// Listen for client events to initialize a new Viewer component
document.body.addEventListener('o.InitViewer', e => new ViewerComponent(e.detail));
