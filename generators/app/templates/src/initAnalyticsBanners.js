/* global ga */
import requiredArg from './utils/requiredArg';

export default function initAnalyticsBanners({
  campaignName = requiredArg('campaignName'),
  bannerIds = [],
}) {
  const banners = bannerIds
    .map(bannerId => document.getElementById(bannerId))
    .filter(banner => !!banner);


  // Google Analytics
  if (typeof ga === 'function') {
    banners.forEach(banner => {
      ga('ec:addPromo', {
        id: `interactive-${campaignName}`,
        name: `interactive ${campaignName}`,
      });

      banner.addEventListener('click', () => {
        ga('ec:addPromo', {
          id: `interactive-${campaignName}`,
          name: `interactive ${campaignName}`,
        });
        ga('ec:setAction', 'promo_click');
        ga('send', 'event', 'Internal Promotions', 'click', campaignName);
      });
    });
  }
}
