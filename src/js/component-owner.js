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
          goToPageCallback={this.props.goToPageCallback}
          viewerLoaded={this.props.viewerLoaded}
          locale={this.props.intl.locale}
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
  goToPageCallback: PropTypes.func,
  viewerLoaded: PropTypes.func,
  intl: intlShape
};

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context
