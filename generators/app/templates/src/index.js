import fireBiRequest from './fireBiRequest';
// import initAnalyticsBanners from './initAnalyticsBanners';
// import initBiBanner from './initBiBanner';
import initSocial from './initSocial';
import lazyloadImages from './lazyloadImages';
import initComments from './comments/index';
// import setLoginBtn from './setLoginBtn';

export default function init() {
  lazyloadImages();
  initSocial();

  /*
   * Your init code here
   */

  initComments();
  // initAnalyticsBanners({
  //   campaignName: undefined, // Replace with the project's campaign name
  //   bannerIds: undefined, // Ids of campaign banners to initiate events for
  // });
  // initBiBanner({
  //   bannerId: undefined, // Replace with the HTML ID of the (clickable) banner element
  //   campaignName: undefined, // Replace with the project's campaign name
  //   campaignDetails: undefined, // Replace with the project's campaign details
  //   featureType: undefined,
  // });

  // setLoginBtn('loginLink');

  // Fire GA pageview
  if (typeof ga === 'function') {
    // eslint-disable-next-line no-undef
    ga('send', 'pageview');
  }
  fireBiRequest();
}
