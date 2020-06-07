let appendedScript = false;

let resolveRecaptchReady = null;

const recaptchaReadyPromise = new Promise(resolve => {
  resolveRecaptchReady = () => {
    resolve(window.grecaptcha);
  };
});

export default function loadGoogleRecaptcha() {
  if (!appendedScript) {
    window.googleRecaptchaReadyCallback = resolveRecaptchReady;

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = 'https://www.google.com/recaptcha/api.js?onload=googleRecaptchaReadyCallback&render=explicit';

    document.body.appendChild(script);
    appendedScript = true;
  }

  return recaptchaReadyPromise;
}
