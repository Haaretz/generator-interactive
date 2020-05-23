import { sendBiEvent, } from './utils/sendBiEvent';
import createImpressionSentinal from './utils/createImpressionSentinal';
import requiredArg from './utils/requiredArg';

export default function initBiNewsletter({
  newsletterId = requiredArg('newsletterId'),
  segmentId = requiredArg('segmentId'),
  segmentName = requiredArg('segmentName'),
  featureType = requiredArg('featureType'),
}) {
  const newsletterElement = document.getElementById(newsletterId);
  const newsletterImpressionData = {
    feature: 'newsletter',
    feature_type: featureType,
    newsletter_segment_id: segmentId, // (e.g. 1.26354)
    newsletter_segment_name: segmentName, // (e.g. travel)
    // the user's email (can be sent for impression only
    //   when field is pre-filled from user data)
    // newsletter_email: throw new Error(),
  };

  const newsletterActionData = {
    ...newsletterImpressionData,
    actionType: 9,
  };

  // BI Action
  if (newsletterElement) {
    const impressionSentinal = createImpressionSentinal(
      newsletterImpressionData
    );
    const observer = new IntersectionObserver(impressionSentinal, {
      rootMargin: '0px',
      threshold: 1,
    });

    newsletterElement.addEventListener(
      'click',
      sendBiEvent({
        eventType: 'action',
        data: newsletterActionData,
      })
    );
    observer.observe(newsletterElement);
  }
}
