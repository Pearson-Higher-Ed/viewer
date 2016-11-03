import React, { PropTypes } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPageNo: 1,
      totalPages: this.props.data.pages.length,
      content: this.props.data.pages[0].content,
      currentPageId: this.props.data.pages[0].id,
      currentPageTitle: this.props.data.pages[0].title,
      prevPageTitle: '',
      nextPageTitle: (this.props.data.pages.length >= 0) ? this.props.data.pages[1].title : '',
      isFirstPage: true,
      isLastPage: false
    };
    this.navigationChanged = this.navigationChanged.bind(this);
  }

  renderEmpty() {
    return (
      <div className="empty-help" >
          <div className="empty-message" tabindex="0">
          </div>
      </div>
    )
  }

  renderContent() {
    return (
      <div className="player-content" dangerouslySetInnerHTML={{__html: this.state.content}}></div>
    );
  }

  componentDidMount() {
    this.pubsub_token = window.pubsub.subscribe('GO_TO_PAGE', function(topic, pageId) {
      this.navigationChanged(pageId);
    }.bind(this));

  }

  componentWillUnmount() {
    window.pubsub.unsubscribe(this.pubsub_token);
  }

  navigationChanged(targetPageId) {
    const that = this;
    const pages = that.props.data.pages;
    const targetPage = find(pages, function(page) { return page.id === targetPageId; });
    const targetPageIndex = findIndex(pages, function(page) { return page.id === targetPageId; });

    // Update application state
    that.props.store.dispatch(that.props.actions.goToPage(targetPageId));

    // Update component state
    that.setState({
      currentPageNo: targetPageIndex + 1,
      content: targetPage.content,
      currentPageId: targetPage.id,
      currentPageTitle: targetPage.title,
      prevPageTitle: targetPageIndex <= 0 ? '' : pages[targetPageIndex - 1].title,
      nextPageTitle: targetPageIndex >= pages.length-1 ? '' : pages[targetPageIndex + 1].title,
      isFirstPage: targetPageIndex <= 0,
      isLastPage: targetPageIndex >= pages.length-1
    });

    //check for bookmarked page or not
    const targetBookMark = find(that.props.store.getState().bookmarks, function(bookmarks) { return bookmarks.uri === targetPage.id; });
    const isBookmarked = targetBookMark === undefined ? false : true;
    window.pubsub.publish('IS_BOOKMARKED', isBookmarked);
  }

  render() {
    return (
      <div id="viewer" role="main">
        <div className="viewer-body">
            {(this.state.content === '') ? this.renderEmpty() : this.renderContent()}
        </div>
        <Navigation data={this.state} pages={this.props.data.pages} callbackParent={this.navigationChanged}/>
      </div>
    )
  }
}

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classname: 'navigation'
    };
  }

  sectionClk = (isNext) => {
    const currentIndex = this.props.data.currentPageNo-1;
    let goToPageId;
    if (!isNext && !this.props.data.isFirstPage) {
      goToPageId = this.props.pages[currentIndex-1].id;
    } else if (isNext && !this.props.data.isLastPage) {
      goToPageId = this.props.pages[currentIndex+1].id;
    }
    this.props.callbackParent(goToPageId);
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
    const prevText = 'Previous';
    const nextText = 'Next';

    return (
      <div className={this.state.classname}>
        <div tabIndex="0" className={`prevSection section ${this.props.data.isFirstPage ? 'hide' : ''}`} title={this.props.data.prevPageTitle} onClick={() => this.sectionClk(false)}>
          <div className="prevContent">
            <div className="label">{prevText}</div>
            <div className="content">{this.props.data.prevPageTitle}</div>
          </div>
        </div>

        <div className={`line ${this.props.data.isFirstPage ? 'hide' : ''}`}></div>
        <div tabIndex="0" className="currentSection section">Page {this.props.data.currentPageNo}</div>
        <div className={`line ${this.props.data.isLastPage ? 'hide' : ''}`}></div>

        <div tabIndex="0" className={`nextSection section ${this.props.data.isLastPage ? 'hide' : ''}`} title={this.props.data.nextPageTitle} onClick={() => this.sectionClk(true)}>
          <div className="nextContent">
            <div className="label">{nextText}</div>
            <div className="content">{this.props.data.nextPageTitle}</div>
          </div>
        </div>
      </div>
    );
  }
}

Viewer.propTypes = {
  intl: intlShape.isRequired,
  locale: PropTypes.string
};

export default injectIntl(Viewer);
