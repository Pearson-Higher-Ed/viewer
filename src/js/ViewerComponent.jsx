import React from 'react';
import { IntlProvider } from 'react-intl';
import InternationalSupport from './InternationalSupport';
import Viewer from './Viewer';

export const ViewerComponent = function ViewerComponent(paramsObj) { // eslint-disable-line import/prefer-default-export
  const intlObj = new InternationalSupport(paramsObj.locale);
  return (<IntlProvider locale={intlObj.getLocale()} messages={intlObj.getMessages()}>
    <Viewer
      data={paramsObj.data}
      goToPageCallback={paramsObj.goToPageCallback}
      viewerLoaded={paramsObj.viewerLoaded}
      isET1 = {paramsObj.isET1}
      getPrevNextPage = {paramsObj.getPrevNextPage}
      pages={paramsObj.pages}
    />
  </IntlProvider>);
};