import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { darkBlack, fullBlack } from 'material-ui/styles/colors';

import Viewer from './Viewer';

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
        <Viewer
          data={this.props.data}
          goToPageCallback={this.props.goToPageCallback}
          viewerDidMount={this.props.viewerDidMount}
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
  goToPageCallback: PropTypes.object.func,
  viewerDidMount: PropTypes.object.func
};

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context
