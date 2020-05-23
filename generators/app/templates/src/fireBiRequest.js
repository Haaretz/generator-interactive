import { DS_BASE_URL, getStatBaseData, } from './utils/sendBiEvent';
import withTimeout from './withTimeout';

export default function fireBiRequest() {
  withTimeout(
    window.fetch(`${DS_BASE_URL}/request`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: getStatBaseData(),
      cache: 'no-cache',
    })
  );
}
