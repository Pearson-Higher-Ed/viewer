/**
PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *  Copyright © 2017 Pearson Education, Inc.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 * patent applications, and are protected by trade secret or copyright law.
 * Dissemination of this information, reproduction of this material, and copying or distribution of this software
 * is strictly forbidden unless prior written permission is obtained
 * from Pearson Education, Inc.
**/

import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import Navigation from './Navigation';

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    if (props.isET1 !== 'Y') {
      const currentPageId = this.props.data.currentPageId ? this.props.data.currentPageId : this.props.data.pages[0].id;
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
  }

  componentDidMount() {
    if (this.props.viewerLoaded) {
      this.props.viewerLoaded(this.state.currentPageId);
    }
    document.body.dispatchEvent(new CustomEvent('contentLoaded')); // eslint-disable-line 
  }

  componentWillReceiveProps(nextProps) {
    // Listen to redux for page changes
    if (nextProps.isET1 !== 'Y') {
      if (this.props.data.currentPageId !== nextProps.data.currentPageId) {
        this.navigationChanged(nextProps.data.currentPageId);
      }
    }
  }
  renderEmpty() {
    return (
      <div className="empty-help" >
        <div role="main" className="empty-message" tabIndex="0">{this.state.content}</div>
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
    const targetPage = find(pages, page => page.id === targetPageId);
    const targetPageIndex = findIndex(pages, page => page.id === targetPageId);

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
  };

  renderNav = () => {
    let navigation = '';
    if (this.props.data.pages.length > 1) {
      navigation = (<Navigation
        intl={this.props.intl}
        data={this.state}
        pages={this.props.data.pages}
        callbackParent={this.props.goToPageCallback}
        getPrevNextPage={this.props.getPrevNextPage}
        goToPageCallback={this.props.goToPageCallback}
        isET1={this.props.isET1}
      />);
    }
    return navigation;
  };
  render() {
    return (
      <div>

        {this.props.isET1 === 'Y' ? <div id="viewer" role="main" tabIndex="0">
          <Navigation
            intl={this.props.intl}
            isET1={this.props.isET1}
            goToPageCallback={this.props.goToPageCallback}
            data={this.props.data}
            getPrevNextPage={this.props.getPrevNextPage}
            pages={this.props.data.pages}
            callbackParent={this.props.callbackParent}
          />
        </div> :
        <div id="viewer" role="presentation" tabIndex="0" onKeyUp={this.arrowNavigation}>
          <div className="viewer-body">
            {(this.state.content === '') ? this.renderEmpty() : this.renderContent()}
          </div>
          {this.renderNav()}
        </div>
      }

      </div>
    );
  }
}

Viewer.propTypes = {
  getPrevNextPage: PropTypes.func.isRequired,
  isET1: PropTypes.string,
  intl: intlShape.isRequired,
  data: PropTypes.object.isRequired,
  goToPageCallback: PropTypes.func.isRequired,
  viewerLoaded: PropTypes.func.isRequired,
  callbackParent: PropTypes.func.isRequired
};

Viewer.defaultProps = {
  isET1: 'N'
};

export default injectIntl(Viewer);
