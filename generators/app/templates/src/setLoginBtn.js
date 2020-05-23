export default function setLoginBtn(id = 'loginLink') {
  const isLoggedIn = document.cookie
    .split(';')
    .some(item => item.trim().startsWith('tmsso='));
  if (!isLoggedIn) {
    const loginLink = document.getElementById(id);
    if (loginLink) loginLink.classList.add('isLoggedOut');
    return loginLink;
  }
  return undefined;
}
