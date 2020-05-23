import { sendBiEvent, } from './sendBiEvent';

export default function createImpressionSentinal(data) {
  return function impressionSentinal(entries, observer) {
    entries.forEach(({ isIntersecting, target, }) => {
      if (isIntersecting) {
        sendBiEvent({
          eventType: 'impression',
          data,
        });

        // Only fire once
        observer.unobserve(target);
      }
    });
  };
}
