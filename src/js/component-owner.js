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
    /*this.createAnn = this.createAnn.bind(this);
    this.deleteAnn = this.deleteAnn.bind(this);
    this.updateAnn = this.updateAnn.bind(this);*/
  }

  getSelectedText() {
    let text = '';
    if (typeof window.getSelection !== 'undefined') {
      text = window.getSelection().toString();
    } else if (typeof document.selection !== 'undefined' && document.selection.type === 'Text') {
      text = document.selection.createRange().text;
    }
    return text;
  }

  /*createAnn() {
    const selectedText = this.getSelectedText();

    if (selectedText) {
      const ann = {
        author: 'Arish',
        color: 'blue',
        time: '12345678',
        text: selectedText,
        comment: 'this is sample comment'
      };
      this.props.store.dispatch(this.props.actions.createAnnotation(ann));
    }
  }

  deleteAnn() {
    const id=0;
    this.props.store.dispatch(this.props.actions.deleteAnnotation(id));
  }

  updateAnn() {
    const ann = {
      id:0,
      author: 'ArishUpdated',
      color: 'Green',
      time: '12345678',
      comment: 'this is updated comment'
    };
    this.props.store.dispatch(this.props.actions.updateAnnotation(ann));
  }*/

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
      <Content contentProp = {this.state.content} />
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
        <Navigation />
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

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
  }

  sectionClk = (section) => {
    alert(section+' is clicked');
  }

  render() {
    const prevContent = 'Section 1: The Introduction';
    const prevText = 'Previous';
    const nextContent = 'Section 3: The Biological';
    const nextText = 'Next';
    const curPageNo = 'Page 10';
    return (
      <div className="navigation">
        <div className="prevSection section" title={prevContent} onClick={() => this.sectionClk('Previous')}>
          <div className="prevContent">
            <div className="label">{prevText}</div>
            <div className="content">{prevContent}</div>
          </div>
        </div>
        <div className="line"></div>
        <div className="currentSection section">{curPageNo}</div>
        <div className="line"></div>
        <div className="nextSection section" title={nextContent} onClick={() => this.sectionClk('Next')}>
          <div className="nextContent">
            <div className="label">{nextText}</div>
            <div className="content">{nextContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

ComponentOwner.propTypes = {
  intl: intlShape.isRequired,
  locale: PropTypes.string
};

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context
