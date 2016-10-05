/*jshint esversion: 6 */
import React, {PropTypes} from 'react';
import {intlShape, injectIntl} from 'react-intl';
import {messages} from './defaultMessages';
import contentful from 'contentful';
import find from 'lodash/find';
import head from 'lodash/head';

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
      <Content contentProp = {this.state.content} />
    );
  }

  componentDidMount() {
    const that = this;
    const space = 'tbx6i45kvpo5';
    const accessToken = 'ddaa1c7c0ebfd27bfacbe8aa5422becf25a444a3bc415cdb0011e06e22f9189a';
    const bookId = window.bookId;
    const tocId = find(that.props.data.store.getState().bookshelf, function (bookshelf) {return bookshelf.id===bookId;}).tocId;
    const toc = find(that.props.data.store.getState().toc, function (toc) {return toc.id===tocId;}).list;
    const firstPage = head(toc);
    const entry = firstPage.id;

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
      classname: 'navigation'
    };
  }

  sectionClk = (section) => {
    alert(section+' is clicked');
  }

  componentDidMount() {
    const that = this;
    let didScroll = false;
    let lastScrollPosition = 0;


    window.addEventListener('scroll', function() {
      didScroll = true;
    });

    setInterval(function() {
      if (didScroll) {
        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        const currentScrollPosition = window.pageYOffset;
        const pageEndReached = currentScrollPosition + window.innerHeight === documentHeight;
        // Scrolling down
        if (currentScrollPosition > lastScrollPosition && !pageEndReached) {
          that.setState({
            classname: 'navigation nav-down'
          });
        }
        // Scrolling Up
        else {
          that.setState({
            classname: 'navigation'
          });
        }
        lastScrollPosition = currentScrollPosition;
        didScroll = false;
      }
    }, 100);
  }



  render() {
    const prevContent = 'Section 1: The Introduction';
    const prevText = 'Previous';
    const nextContent = 'Section 3: The Biological';
    const nextText = 'Next';
    const curPageNo = 'Page 10';

    return (
      <div className={this.state.classname}>
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
