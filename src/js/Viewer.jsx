import React from 'react';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import Navigation from './Navigation';

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

  componentDidMount() {
    document.body.dispatchEvent(new CustomEvent('contentLoaded'));
  }

  renderEmpty() {
    return (
      <div className="empty-help" >
        <div className="empty-message" tabIndex="0">{this.state.content}</div>
      </div>
    );
  }

  renderContent() {
    return (
      <div className="player-content" dangerouslySetInnerHTML={{ __html: this.state.content }} />
    );
  }

  navigationChanged(targetPageId) {
    const that = this;
    const pages = that.props.data.pages;
    /* eslint-disable */
    const targetPage = find(pages, function(page) { return page.id === targetPageId; });
    const targetPageIndex = findIndex( pages, function(page) { return page.id === targetPageId; } );
    /* eslint-enable */

    // Update application state
    that.props.goToPageCallback(targetPageId);

    // Update component state
    that.setState({
      currentPageNo: targetPageIndex + 1,
      content: targetPage.content,
      currentPageId: targetPage.id,
      currentPageTitle: targetPage.title,
      prevPageTitle: targetPageIndex <= 0 ? '' : pages[targetPageIndex - 1].title,
      nextPageTitle: targetPageIndex >= pages.length - 1 ? '' : pages[targetPageIndex + 1].title,
      isFirstPage: targetPageIndex <= 0,
      isLastPage: targetPageIndex >= pages.length - 1
    });

    document.body.dispatchEvent(new CustomEvent('navChanged'));

    // check for bookmarked page or not
    /* const targetBookMark = find(that.props.store.getState().bookmarks, function(bookmarks) { return bookmarks.uri === targetPage.id; });
    const isBookmarked = targetBookMark === undefined ? false : true;
    window.pubsub.publish('IS_BOOKMARKED', isBookmarked);*/
  }

  arrowNavigation = (e) => {
    if (e.keyCode === 37 || e.keyCode === 39) {
      const currentIndex = this.state.currentPageNo - 1;
      let reqId = null;
      if (e.keyCode === 37) {
        reqId = this.state.isFirstPage ? null : this.props.data.pages[currentIndex - 1].id;
      } else {
        reqId = this.state.isLastPage ? null : this.props.data.pages[currentIndex + 1].id;
      }
      if (reqId !== null) {
        this.navigationChanged(reqId);
      }
    }
  }

  render() {
    return (
      <div id="viewer" role="main" tabIndex="0" onKeyUp={this.arrowNavigation}>
        <div className="viewer-body">
          {(this.state.content === '') ? this.renderEmpty() : this.renderContent()}
        </div>
        <Navigation data={this.state} pages={this.props.data.pages} callbackParent={this.navigationChanged} />
      </div>
    );
  }
}

Viewer.propTypes = {
  data: React.PropTypes.object.isRequired
};

export default Viewer;
