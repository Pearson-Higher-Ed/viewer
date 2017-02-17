import React from 'react';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import Navigation from './Navigation';

class Viewer extends React.Component {
  constructor(props) {
    super(props);

    const currentPageId = (this.props.data.currentPageId ? this.props.data.currentPageId : this.props.data.pages[0].id);
    const currentPageIndex = (this.props.data.pages.findIndex(page => page.id === currentPageId));
    const currentPageNo = currentPageIndex + 1;
    const currentPageObj = (this.props.data.pages.find(page => page.id === currentPageId));

    this.state = {
      currentPageNo,
      totalPages: this.props.data.pages.length,
      content: currentPageObj.content,
      currentPageId,
      currentPageTitle: currentPageObj.title,
      prevPageTitle: (currentPageIndex <= 0) ? '' : this.props.data.pages[currentPageIndex - 1].title,
      nextPageTitle: (this.props.data.pages.length >= 0 && currentPageNo < this.props.data.pages.length) ?
        this.props.data.pages[currentPageNo].title : '',
      isFirstPage: currentPageNo === 1,
      isLastPage: currentPageNo === this.props.data.pages.length
    };
    this.navigationChanged = this.navigationChanged.bind(this);
  }

  componentDidMount() {
    this.props.viewerLoaded(this.state.currentPageId);
    document.body.dispatchEvent(new CustomEvent('contentLoaded')); // eslint-disable-line 
  }

  componentWillReceiveProps(nextProps) {
    // Listen to redux for page changes
    if (this.props.data.currentPageId !== nextProps.data.currentPageId) {
      this.navigationChanged(nextProps.data.currentPageId);
    }
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

    document.body.dispatchEvent(new CustomEvent('navChanged')); // eslint-disable-line 

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
        this.props.goToPageCallback(reqId);
      }
      window.scroll(0, 0);
    }
  }

  render() {
    return (
      <div id="viewer" role="main" tabIndex="0" onKeyUp={this.arrowNavigation}>
        <div className="viewer-body">
          {(this.state.content === '') ? this.renderEmpty() : this.renderContent()}
        </div>
        <Navigation data={this.state} pages={this.props.data.pages} callbackParent={this.props.goToPageCallback} />
      </div>
    );
  }
}

Viewer.propTypes = {
  data: React.PropTypes.object.isRequired,
  goToPageCallback: React.PropTypes.func.isRequired,
  viewerLoaded: React.PropTypes.func
};

export default Viewer;
