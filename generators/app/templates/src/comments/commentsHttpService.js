const baseUrl = 'https://www.<%= site.toLowerCase() %>';
let lineageStr = '';

export const setLineageStr = str => {
  lineageStr = str;
};

const queryStringify = params => {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([ key, val, ]) => {
    urlParams.append(key, `${val}`);
  });

  return urlParams.toString();
};

export function fetchComments(commentsId) {
  return fetch(`${baseUrl}/json/cmlink/${commentsId}?composite=true&ts=${Date.now()}`)
    .then(res => res.json());
}

export function createComment({
  commentsId,
  articleId,
  parentCommentId,
  name,
  comment,
}) {
  const body = queryStringify({
    commentsId,
    articleId,
    parentCommentId,
    comment_author: name,
    comment_text: comment,
    formId: 'comments-form',
    action: 'CREATE_COMMENT',
    ajax: true,
  });

  return fetch(`${baseUrl}/cmlink/${commentsId}`, {
    method: 'POST',
    body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  }).then(res => res.json());
}

export function signUpCommentPublishNotification({
  email,
  commentId,
  commentHash,
}) {
  const body = queryStringify({
    userEmail: email,
    c: commentId,
    h: commentHash,
    a: '2',
    // TODO: cheack what needs to be here allowMarketing true /false ?
    m: '',
    // TODO: check what needs to be here paying/anonymous check from cookie?
    ut: 'anonymous',
  });

  return fetch(`${baseUrl}/comments/acceptreject`, {
    method: 'POST',
    body,
    createComment: 'include',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  }).then(res => res.json());
}

export function rateComment({ commentId, isDislike, }) {
  return fetch(`${baseUrl}/logger/p.gif?type=COMMENTS_RATINGS&a=${
    lineageStr
  }&comment=${commentId}&group=${isDislike ? 'minus' : 'plus'}&_=${Date.now()}`, {
    credentials: 'include',
    headers: { Accept: '*/*', },
  })
    .then(res => res.json());
}

export function reportComment({ recaptchaToken, commentId, commentsId, }) {
  return fetch(`${baseUrl}/cmlink/${commentsId}`, {
    method: 'POST',
    body: queryStringify({
      commentId,
      'g-recaptcha-response': recaptchaToken,
      invisible: true,
      action: 'REPORT_COMMENT_ABUSE',
      ajax: true,
    }),
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  })
    .then(res => res.json())
    .catch(err => ({ reportSuccess: false, }));
}
