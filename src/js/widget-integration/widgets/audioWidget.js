import React, { Component } from 'react';
import { AudioPlayer } from '@pearson-incubator/aquila-js-core';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


export default class AudioWidget extends React.Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired
  };

  static getChildContext() {
    return {
      muiTheme: this.props.muiTheme
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={this.props.muiTheme}>
        <AudioPlayer url={this.props.data.source} title={this.props.data.title} />
      </MuiThemeProvider>
    )
  }
};

AudioWidget.contextTypes = {
  muiTheme: React.PropTypes.object
};

