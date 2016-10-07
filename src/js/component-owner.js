import React, {PropTypes} from 'react';
import {intlShape, injectIntl} from 'react-intl';
import contentful from 'contentful';
import find from 'lodash/find';
import head from 'lodash/head';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';

class ComponentOwner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      tocArray:[],
      store:{},
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
      <Content contentProp = {this.state.content} />
    );
  }

  fetchContent(pageId) {
    const that = this;
    const pageList = that.props.data.store.getState().toc[0].list;
    const pageTitle = find(pageList, function (list) {return list.id===pageId;}).title
    const tocArray = map(pageList, 'id');
    const currentPageIndex = findIndex(tocArray, function (tocPageId) { return tocPageId === pageId});
    const currentPageNo = currentPageIndex + 1;
    const nextPageTitle = currentPageNo >= pageList.length ? '' : pageList[currentPageIndex+1].title
    const prevPageTitle = currentPageNo <= 1 ? '' : pageList[currentPageIndex-1].title
    const pageDetails = {
      pageId: pageId,
      pageTitle: pageTitle,
      currentPage:currentPageNo,
      totalPages: pageList.length,
      prevPageTitle: prevPageTitle,
      nextPageTitle: nextPageTitle
    };
    that.props.data.store.dispatch(that.props.data.viewerActions.getPage(pageDetails));
    const entry = that.props.data.store.getState().viewer.pageId
    const space = 'tbx6i45kvpo5';
    const accessToken = 'ddaa1c7c0ebfd27bfacbe8aa5422becf25a444a3bc415cdb0011e06e22f9189a';
    const client = contentful.createClient({
      space: space,
      accessToken: accessToken
    });

    this.serverRequest = client.getEntry(entry).then((response) =>{
      that.props.data.store.dispatch(that.props.data.viewerActions.getPageContent(response.fields.content));
      that.setState({
        content: that.props.data.store.getState().viewer.pageContent,
        store: that.props.data.store.getState()
      });
    });
  }

  navigationChanged(pageId) {
    if (pageId) {
      this.fetchContent(pageId);
    }
  }

  componentWillMount() {
    const that = this;
    const bookId = window.bookId;
    const tocId = find(that.props.data.store.getState().bookshelf, function (bookshelf) {return bookshelf.id===bookId;}).tocId;
    const toc = find(that.props.data.store.getState().toc, function (toc) {return toc.id===tocId;}).list;
    const firstPage = head(toc);
    const secondPagetitle = toc[1].title;
    const tocArray = map(toc, 'id');
    const pageDetails = {
      pageId: firstPage.id,
      pageTitle: firstPage.title,
      currentPage: 1,
      totalPages: tocArray.length,
      prevPageTitle:'',
      nextPageTitle:secondPagetitle
    };
    that.props.data.store.dispatch(that.props.data.viewerActions.getPage(pageDetails));
    that.setState({
      tocArray: tocArray,
      store: that.props.data.store.getState()
    });
  }

  componentDidMount() {
    const pageId = this.props.data.store.getState().viewer.pageId
    this.fetchContent(pageId)
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
        <Navigation data={this.state} callbackParent={this.navigationChanged}/>
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
    const currentPageId = this.props.data.store.viewer.pageId;
    const currentIndex = findIndex(this.props.data.tocArray, function (pageId) { return pageId === currentPageId})
    this.props.data.isFirstPage = currentIndex === 0 ? true : false;
    this.props.data.isLastPage = this.props.data.tocArray.length -1 === currentIndex ? true : false
    let reqPageId;
    if (section.toUpperCase() === 'PREVIOUS' && !this.props.data.isFirstPage) {
      reqPageId = this.props.data.tocArray[currentIndex-1];
    } else if (section.toUpperCase() === 'NEXT' && !this.props.data.isLastPage) {
      reqPageId = this.props.data.tocArray[currentIndex+1];
    }
    this.props.callbackParent(reqPageId);
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
    const prevContent = this.props.data.store.viewer.prevPageTitle;
    const prevText = 'Previous';
    const nextContent = this.props.data.store.viewer.nextPageTitle;
    const nextText = 'Next';
    const curPageNo = this.props.data.store.viewer.currentPageNo;

    return (
      <div className={this.state.classname}>
        <div tabIndex="0" className="prevSection section" title={prevContent} onClick={() => this.sectionClk('Previous')}>
          <div className="prevContent">
            <div className="label">{prevText}</div>
            <div className="content">{prevContent}</div>
          </div>
        </div>
        <div className="line"></div>
        <div tabIndex="0"  className="currentSection section">Page {curPageNo}</div>
        <div className="line"></div>
        <div tabIndex="0" className="nextSection section" title={nextContent} onClick={() => this.sectionClk('Next')}>
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
