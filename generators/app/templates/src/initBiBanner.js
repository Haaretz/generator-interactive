import { sendBiEvent, } from './utils/sendBiEvent';
import createImpressionSentinal from './utils/createImpressionSentinal';
import requiredArg from './utils/requiredArg';

export default function initBiBanner({
  bannerId = requiredArg('bannerId'),
  campaignName = requiredArg('campaignName'),
  campaignDetails,
  featureType = 'Marketing',
}) {
  const bannerElement = document.getElementById(bannerId);

  const bannerImpressionData = {
    feature: 'banner',
    feature_type: featureType,
    campaign_name: campaignName,
    campaign_details:
      campaignDetails || (bannerElement && bannerElement.textContent),
  };

  const bannerActionData = {
    ...bannerImpressionData,
    actionType: 3,
  };

  // BI Action
  if (bannerElement) {
    const impressionSentinal = createImpressionSentinal(bannerImpressionData);
    const observer = new IntersectionObserver(impressionSentinal, {
      rootMargin: '0px',
      threshold: 1,
    });

    bannerElement.addEventListener('click', () => sendBiEvent({
      eventType: 'action',
      data: bannerActionData,
    }));
    observer.observe(bannerElement);
  }
}
