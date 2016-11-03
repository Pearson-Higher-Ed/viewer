import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';
import itLocaleData from 'react-intl/locale-data/it';
import nlLocaleData from 'react-intl/locale-data/nl';
import frJson from './translations/fr.json';
import itJson from './translations/it.json';
import nlJson from './translations/nl.json';
import Viewer from './src/js/Viewer';
import './main.scss';

const translations = {
  'fr' : frJson,
  'it' : itJson,
  'nl' : nlJson
};

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
        <Viewer data={config.data} store={config.store} actions={config.viewerActions} />
      </IntlProvider>,
      document.getElementById(config.elementId)
    );
  }
}

export Viewer from './src/js/Viewer';

// Listen for client events to initialize a new Viewer component
document.body.addEventListener('o.InitViewer', e => new ViewerComponent(e.detail));
