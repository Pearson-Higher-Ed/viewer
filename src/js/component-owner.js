import React, {PropTypes} from 'react';
import {intlShape, injectIntl} from 'react-intl';
import {messages} from './defaultMessages';
import contentful from 'contentful';

class ComponentOwner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
  }

  renderEmpty() {
    const {formatMessage} = this.props.intl;

    return (
      <div className="empty-help" >
          <div className="empty-message" tabindex="0">
            <p>{formatMessage(messages.emptyMessage)}</p>
          </div>
      </div>
    )
  }

  renderContent() {
    return (
      <Content contentProp = {this.state.content}/>
    );
  }

  componentDidMount() {
    const that = this;
    const space = 'tbx6i45kvpo5';
    const accessToken = 'ddaa1c7c0ebfd27bfacbe8aa5422becf25a444a3bc415cdb0011e06e22f9189a';
    const entry = 'lhkEkHHAPuYi0GQUUMwyU';

    const client = contentful.createClient({
      space: space,
      accessToken: accessToken
    });

    this.serverRequest = client.getEntry(entry).then((response) =>{
      that.setState({
        content: response.fields.content
      });
    });
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  render() {
    return (
      <div id="viewer" role="main">
          <div className="viewer-body">
              {(this.state.content === '') ? this.renderEmpty() : this.renderContent()}
          </div>
      </div>
    )
  }
}

class Content extends React.Component {
  render() {
    return (
      <div className="player-content" dangerouslySetInnerHTML={{__html: this.props.contentProp}}></div>
    );
  }
}

ComponentOwner.propTypes = {
  intl: intlShape.isRequired,
  locale: PropTypes.string
};

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context
