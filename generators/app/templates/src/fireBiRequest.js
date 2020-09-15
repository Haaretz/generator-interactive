import { DS_BASE_URL, getStatBaseData, } from './utils/sendBiEvent';
import withTimeout from './withTimeout';

export default function fireBiRequest() {
  try {
    withTimeout(
      window.fetch(`${DS_BASE_URL}/request`, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getStatBaseData()),
        cache: 'no-cache',
      })
    );
  }
  catch (err) {
    console.error(err.stack);
  }
}
