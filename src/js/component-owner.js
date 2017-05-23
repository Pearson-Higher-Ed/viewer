import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { darkBlack, fullBlack } from 'material-ui/styles/colors';

import { ViewerComponent } from './ViewerComponent';

const muiTheme = getMuiTheme({
  palette: {
    textColor: darkBlack,
    shadowColor: fullBlack
  }
});

class ComponentOwner extends React.Component {
  /* eslint-disable */
  getChildContext() {
    return {
      muiTheme
    };
  }
  /* eslint-enable */
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <ViewerComponent
          data={this.props.data}
          isET1={this.props.isET1}
          goToPageCallback={this.props.goToPageCallback}
          viewerLoaded={this.props.viewerLoaded}
          locale={this.props.intl.locale}
          getPrevNextPage={this.props.getPrevNextPage}
          callbackParent={this.props.callbackParent}
        />
      </MuiThemeProvider>
    );
  }
}

ComponentOwner.childContextTypes = {
  muiTheme: PropTypes.object.isRequired
};

ComponentOwner.propTypes = {
  data: PropTypes.object.isRequired,
  isET1: PropTypes.string.isRequired,
  goToPageCallback: PropTypes.func.isRequired,
  viewerLoaded: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  getPrevNextPage: PropTypes.func.isRequired,
  callbackParent: PropTypes.func.isRequired
};

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context
