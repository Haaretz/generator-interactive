export default function initSocial() {
  const fbBtns = document.getElementsByClassName('jsFbShare');
  const twitterBtns = document.getElementsByClassName('jsTwitterShare');

  const url = document.querySelector('link[rel="canonical"]') ? document.querySelector('link[rel="canonical"]').getAttribute('href') : null;
  const title = document.querySelector('meta[property="og:title"]') ? document.querySelector('meta[property="og:title"]').getAttribute('content') : null;

  [ ...fbBtns, ].forEach(btn => {
    btn.addEventListener('click', () => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        'facebook-share-dialog',
        'width=800,height=600'
      );
    });
  });
  [ ...twitterBtns, ].forEach(btn => {
    btn.addEventListener('click', () => {
      window.open(
        `https://twitter.com/intent/tweet?url=${url}&text=${title}&via=haaretz`,
        'twitter-share-dialog',
        'width=800,height=600'
      );
    });
  });
}
