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
import SvgIcon from 'material-ui/SvgIcon';
import { intlShape } from 'react-intl';
import { AnalyticsManager } from '@pearson-incubator/aquila-js-core';
import { messages } from './defaultMessages';


class Navigation extends React.Component {
  navInterval = 0;
  pageSections = {
    ns: null,
    ps: null,
    cs: null
  };
  constructor(props) {
    super(props);
    this.state = {
      classname: 'navigation'
    };
  }

  componentWillUnmount() {
    if (this.navInterval !== 0) {
      clearInterval(this.navInterval);
      this.navInterval = 0;
    }
  }

  componentDidMount() {
    const that = this;
    let didScroll = false;
    let lastScrollPosition = 0;
    if (window.pageYOffset !== 0) {
      window.scroll(0, 0);
    }
    /* eslint-disable */
    window.addEventListener('scroll', function() {
      didScroll = true;
    });

    this.navInterval = setInterval(function() {
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
    /* eslint-enable */
  }

  sectionClk = (isNext) => {
    if (this.props.isET1 === 'Y') {
      if (isNext) {
        this.props.goToPageCallback('next');
      } else {
        this.props.goToPageCallback('prev');
      }
    } else {
      const currentIndex = this.props.data.currentPageNo - 1;
      let goToPageId;
      if (!isNext && !this.props.data.isFirstPage) {
        goToPageId = this.props.pages[currentIndex - 1].id;
      } else if (isNext && !this.props.data.isLastPage) {
        goToPageId = this.props.pages[currentIndex + 1].id;
      }
      this.props.callbackParent(goToPageId);
      window.scroll(0, 0);
      AnalyticsManager.dispatch({
        category: 'Navigation',
        action: isNext ? 'Next' : 'Prev',
        label: goToPageId
      });
    }
  };

  handleFocus = (section) => {
    if (section === 'prevSection' && this.pageSections.ps) {
      this.pageSections.ps.classList.add('focus');
    } else if (section === 'currentSection' && this.pageSections.cs) {
      this.pageSections.cs.classList.add('focus');
    } else if (section === 'nextSection' && this.pageSections.ns) {
      this.pageSections.ns.classList.add('focus');
    }
  };

  removeFocus = (section) => {
    if (section === 'prevSection' && this.pageSections.ps) {
      this.pageSections.ps.classList.remove('focus');
    } else if (section === 'currentSection' && this.pageSections.cs) {
      this.pageSections.cs.classList.remove('focus');
    } else if (section === 'nextSection' && this.pageSections.ns) {
      this.pageSections.ns.classList.remove('focus');
    }
  };

  getPageNumber = (pageType) => {
    let pageNumber;
    if (pageType === 'prev') {
      pageNumber = this.props.getPrevNextPage('prev');
      return `Page ${pageNumber}`;
    } else if (pageType === 'next') {
      pageNumber = this.props.getPrevNextPage('next');
      return `Page ${pageNumber}`;
    } else if (pageType === 'last') {
      pageNumber = this.props.getPrevNextPage('last');
      return `Page ${pageNumber}`;
    }
    return '';
  };

  render() {
    const { formatMessage } = this.props.intl;
    const style = {
      nextBtn: {
        height: '12px',
        width: '24px',
        float: 'right',
        margin: '9px 0 0 0'
      },
      prevBtn: {
        height: '12px',
        width: '24px',
        float: 'left',
        margin: '9px 0 0 0'
      }
    };
    /* eslint-disable */
    const NextBtn = (props) => (
      <SvgIcon {...props}>
        <path
          d="M1211.56028,31.7501875 L1214.03008,29.2804375 C1214.32334,28.9871875 1214.32334,
          28.5131875 1214.03008,28.2199375 C1213.73682,27.9266875 1213.26281,27.9266875 1212.96956,
          28.2199375 L1209.22023,31.9691875 C1209.18498,32.0044375 1209.15348,32.0434375 1209.12573,
          32.0846875 C1209.11373,32.1019375 1209.10623,32.1214375 1209.09573,32.1401875 C1209.08223,
          32.1641875 1209.06798,32.1874375 1209.05673,32.2136875 C1209.04698,32.2376875 1209.04098,
          32.2631875 1209.03348,32.2879375 C1209.02748,32.3104375 1209.01923,32.3306875 1209.01473,
          32.3531875 C1208.99522,32.4499375 1208.99522,32.5496875 1209.01473,32.6471875 C1209.01923,
          32.6696875 1209.02748,32.6899375 1209.03348,32.7116875 C1209.04098,32.7371875 1209.04698,
          32.7626875 1209.05673,32.7866875 C1209.06798,32.8129375 1209.08223,32.8361875 1209.09573,
          32.8601875 C1209.10623,32.8789375 1209.11373,32.8984375 1209.12573,32.9156875 C1209.15348,
          32.9569375 1209.18498,32.9959375 1209.22023,33.0311875 L1212.96956,36.7804375 C1213.11581,
          36.9266875 1213.30781,37.0001875 1213.49982,37.0001875 C1213.69182,37.0001875 1213.88383,
          36.9266875 1214.03008,36.7804375 C1214.32334,36.4871875 1214.32334,36.0131875 1214.03008,
          35.7199375 L1211.56028,33.2501875 L1226.25008,33.2501875 C1226.66409,33.2501875 1227.0001,
          32.9141875 1227.0001,32.5001875 C1227.0001,32.0861875 1226.66409,31.7501875 1226.25008,
          31.7501875 L1211.56028,31.7501875 Z"
          fill="#6a7070"
          transform="translate(1218.000100, 32.500094) rotate(180.000000) translate(-1218.000100, -32.500094)" />
      </SvgIcon>
    );

    const PrevBtn = (props) => (
      <SvgIcon {...props}>
        <path
          d="M41.2500844,31.7501875 L26.5602783,31.7501875 L29.0300798,29.2804375 C29.3233359,28.9871875 29.3233359,
          28.5131875 29.0300798,28.2199375 C28.7368237,27.9266875 28.2628138,27.9266875 27.9695577,
          28.2199375 L24.2202296,31.9691875 C24.1849789,32.0044375 24.1534782,32.0434375 24.1257276,
          32.0846875 C24.1137274,32.1019375 24.1062272,32.1214375 24.095727,32.1401875 C24.0822267,
          32.1641875 24.0679764,32.1874375 24.0567262,32.2136875 C24.046976,32.2376875 24.0409759,
          32.2631875 24.0334757,32.2879375 C24.0274756,32.3104375 24.0192254,32.3306875 24.0147253,
          32.3531875 C23.9952249,32.4499375 23.9952249,32.5496875 24.0147253,32.6471875 C24.0192254,
          32.6696875 24.0274756,32.6899375 24.0334757,32.7116875 C24.0409759,32.7371875 24.046976,
          32.7626875 24.0567262,32.7866875 C24.0679764,32.8129375 24.0822267,32.8361875 24.095727,
          32.8601875 C24.1062272,32.8789375 24.1137274,32.8984375 24.1257276,32.9156875 C24.1534782,
          32.9569375 24.1849789,32.9959375 24.2202296,33.0311875 L27.9695577,36.7804375 C28.1158107,
          36.9266875 28.3078147,37.0001875 28.4998187,37.0001875 C28.6918227,37.0001875 28.8838267,
          36.9266875 29.0300798,36.7804375 C29.3233359,36.4871875 29.3233359,36.0131875 29.0300798,
          35.7199375 L26.5602783,33.2501875 L41.2500844,33.2501875 C41.664093,33.2501875 42.0001,
          32.9141875 42.0001,32.5001875 C42.0001,32.0861875 41.664093,31.7501875 41.2500844,31.7501875"
          fill="#6a7070" />
      </SvgIcon>
    );
    /* eslint-enable */
    return (
      <div className={this.state.classname}>
        <div
          tabIndex="0"
          role="link"
          aria-label={formatMessage(messages.previousPage)}
          className={`prevSection section ${this.props.data.isFirstPage ? 'hide' : ''}`}
          ref={(ref) => { this.pageSections.ps = ref; }}
          title={this.props.data.prevPageTitle}
          onClick={() => this.sectionClk(false)}
          onKeyPress={() => this.sectionClk(false)}
          onKeyUp={() => this.handleFocus('prevSection')}
          onBlur={() => this.removeFocus('prevSection')}
        >
          <div className="prevContent">
            <PrevBtn viewBox="24 28 18 9" style={style.prevBtn} />
            <div className="wrapper">
              <div className="label">{formatMessage(messages.previous)}</div>
              {
                this.props.isET1 === 'Y' ?
                  <div className="content">{this.getPageNumber('prev')}</div> :
                  <div className="content">{this.props.data.prevPageTitle}</div>
              }
            </div>
          </div>
        </div>

        <div className={`line ${this.props.data.isFirstPage ? 'hide' : ''}`} />
        <div
          tabIndex="0"
          role="presentation"
          className="currentSection section"
          ref={(ref) => { this.pageSections.cs = ref; }}
          onKeyUp={() => this.handleFocus('currentSection')}
          onBlur={() => this.removeFocus('currentSection')}
        >{formatMessage(messages.page)} {this.props.data.currentPageNo}</div>
        <div className={`line ${this.props.data.isLastPage ? 'hide' : ''}`} />

        <div
          tabIndex="0"
          role="link"
          aria-label={formatMessage(messages.nextPage)}
          className={`nextSection section ${this.props.data.isLastPage ? 'hide' : ''}`}
          ref={(ref) => { this.pageSections.ns = ref; }}
          title={this.props.data.nextPageTitle}
          onClick={() => this.sectionClk(true)}
          onKeyPress={() => this.sectionClk(true)}
          onKeyUp={() => this.handleFocus('nextSection')}
          onBlur={() => this.removeFocus('nextSection')}
        >
          <div className="nextContent">
            <div className="wrapper">
              <div className="label">{formatMessage(messages.next)}</div>
              {this.props.isET1 === 'Y' ?
                <div className="content">{this.getPageNumber('next')}</div> :
                <div className="content">{this.props.data.nextPageTitle}</div>}
            </div>
            <NextBtn viewBox="1209 28 18 9" style={style.nextBtn} />
          </div>
        </div>
      </div>
    );
  }
}

Navigation.propTypes = {
  getPrevNextPage: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  goToPageCallback: PropTypes.func.isRequired,
  isET1: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  pages: PropTypes.array.isRequired,
  callbackParent: PropTypes.func.isRequired
};

export default Navigation;
