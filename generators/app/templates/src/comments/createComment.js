// data fetching: https://www.haaretz.co.il/json/cmlink/${commentsContentId}?composite=true
import texts from './texts';
import { rateComment, reportComment, } from './commentsHttpService';
import { createHtzButton, } from './commonElements';
import initCommentForm from './commentForm';
import loadGoogleRecaptcha from './loadGoogleRecaptcha';

export default function createComment({ data, parentData, commentsId, isFirst, }) {
  const wrapper = document.createElement('article');
  const articleClasses = [ 'comment', ...(data.isSubComment ? [ 'comment--sub', ] : []), ];
  wrapper.classList.add(...articleClasses);

  const commentIdxEl = document.createElement('div');
  if (!data.isSubComment) {
    commentIdxEl.classList.add('commentIdx');
    if (data.commentIdx > 999) {
      commentIdxEl.classList.add('commentIdx--quad');
    }
    else if (data.commentIdx > 99) {
      commentIdxEl.classList.add('commentIdx--tri');
    }
    commentIdxEl.textContent = data.commentIdx;
  }
  else if (isFirst) {
    commentIdxEl.appendChild(createReplyIcon());
  }

  const commentMainChildren = [
    createCommentHeader(data, parentData || {}),
    createStatefulCommentLikeButtons(data),
    (() => {
      const commentContentEl = document.createElement('div');
      commentContentEl.innerHTML = data.commentText;
      return commentContentEl;
    })(),
    createCommentControls(data, commentsId, wrapper),
  ];

  const commentMainEl = document.createElement('div');
  commentMainChildren.forEach(el => {
    commentMainEl.appendChild(el);
  });

  if (Array.isArray(data.subComments)) {
    data.subComments.forEach((comment, i) => {
      commentMainEl.appendChild(
        createComment({ data: comment, parentData: data, commentsId, isFirst: i === 0, })
      );
    });
  }

  wrapper.appendChild(commentIdxEl);
  wrapper.appendChild(commentMainEl);

  return wrapper;
}

function createCommentHeader(
  { author, publishingDateForDisplay, },
  { author: parentAuthor, } = {}
) {
  const commentHeaderEl = document.createElement('div');
  commentHeaderEl.classList.add('commentHeader');

  const commentAuthorEl = document.createElement('h3');
  commentAuthorEl.classList.add('commentAuthor');
  commentAuthorEl.textContent = author;

  const commentDateEl = document.createElement('span');
  commentDateEl.classList.add('commentDate');
  commentDateEl.textContent = publishingDateForDisplay;

  commentHeaderEl.appendChild(commentAuthorEl);
  commentHeaderEl.appendChild(commentDateEl);

  if (parentAuthor) {
    const parentAuthorEl = document.createElement('span');
    parentAuthorEl.classList.add('commentParentAuthor');
    const arrowIcon = createArrowIcon();

    parentAuthorEl.appendChild(arrowIcon);
    parentAuthorEl.appendChild(document.createTextNode(` ${parentAuthor}`));

    commentHeaderEl.appendChild(parentAuthorEl);
  }

  return commentHeaderEl;
}

function createStatefulCommentLikeButtons(data) {
  const commentId = data.commentId;
  const likeButtonsWrapper = document.createElement('div');
  likeButtonsWrapper.classList.add('commentLikeButtons');

  const likeButtons = [ false, true, ].map(isDislike => {
    const button = document.createElement('button');
    button.dataset.like = `${!isDislike}`;
    const likeIcon = createLikeIcon(isDislike);
    const likeCountEl = document.createElement('span');
    likeCountEl.classList.add('likesCount');
    likeCountEl.textContent = isDislike ? data.dislikesCount : data.likesCount;
    button.appendChild(likeIcon);
    button.appendChild(likeCountEl);

    return button;
  });

  const clickHandler = ({ currentTarget, }) => {
    const countEl = currentTarget.querySelector('.likesCount');
    const isDislike = currentTarget.dataset.like === 'false';
    rateComment({ commentId, isDislike, })
      // .then(res => console.log('rate res', { commentId, isDislike, }))
      .catch(() => {
        // countEl.textContent = isDislike ? data.dislikesCount : data.likesCount;
        // likeButtons.forEach((button, i) => {
        //   button.removeAttribute('disabled');
        //   button.addEventListener('click', clickHandler);
        // })
      });

    countEl.textContent = isDislike
      ? `${data.dislikesCount + 1}`
      : `${data.likesCount + 1}`;

    likeButtons.forEach(button => {
      button.setAttribute('disabled', 'true');
      button.removeEventListener('click', clickHandler);
    });
  };

  likeButtons.forEach(button => {
    button.addEventListener('click', clickHandler);
    likeButtonsWrapper.appendChild(button);
  });

  return likeButtonsWrapper;
}

function createStatefulReplyButton(data, commentWrapper, controlsWrapper) {
  const replyButton = createHtzButton({ text: texts.reply, extraClasses: [ 'commentReply', ], });
  const contentEl = replyButton.querySelector('.htzButton__content');

  const openCommentForm = () => {
    const formWrapper = document.createElement('div');
    if (data.isSubComment) {
      formWrapper.classList.add('commentForm--doubleSub');
      commentWrapper.appendChild(formWrapper);
    }
    else {
      controlsWrapper.insertAdjacentElement('afterend', formWrapper);
    }

    const closeForm = initCommentForm({
      wrapper: formWrapper,
      articleId: data.articleId,
      commentsId: data.commentsId,
      parentCommentId: data.isSubComment ? data.parentCommentId : data.commentId,
      onClose: () => {
        contentEl.textContent = texts.reply;
        replyButton.removeEventListener('click', closeForm);
        replyButton.addEventListener('click', openCommentForm);
      },
    });

    contentEl.textContent = texts.cancel;
    replyButton.removeEventListener('click', openCommentForm);
    replyButton.addEventListener('click', closeForm);
  };

  replyButton.addEventListener('click', openCommentForm);

  return replyButton;
}

function createStatefulReportButton(data, commentsId, controlsWrapper) {
  const reportButton = createHtzButton({
    variant: 'negative',
    text: texts.report,
    extraClasses: [ 'commentReport', ],
  });

  reportButton.disabled = true;

  loadGoogleRecaptcha().then(grecaptcha => {
    let widgetId = null;
    let isBusy = false;
    const clickHandler = () => {
      if (isBusy) return;

      isBusy = true;
      reportButton.classList.add('htzButton--busy');

      if (widgetId == null) {
        const widgetContainer = document.createElement('div');
        widgetContainer.classList.add('commentReportWidget');
        controlsWrapper.appendChild(widgetContainer);

        widgetId = grecaptcha.render(widgetContainer, {
          sitekey: '6LcC3usUAAAAAByOPVWv3pn9KXAwstot5vYjk1Gb',
          size: 'invisible',
          badge: 'inline',
          callback: async recaptchaToken => {
            const { reportSuccess, } = await reportComment(
              { commentId: data.commentId, commentsId, recaptchaToken, }
            );
            if (reportSuccess) {
              reportButton.textContent = texts.reportSuccess;
              reportButton.disabled = true;
              reportButton.removeEventListener('submit', clickHandler);
            }
            else {
              reportButton.textContent = texts.reportFail;
              grecaptcha.reset(widgetId);
            }

            isBusy = false;
            reportButton.classList.remove('htzButton--busy');
          },
        });
      }

      grecaptcha.execute(widgetId);
    };

    reportButton.addEventListener('click', clickHandler);
    reportButton.disabled = false;
  });

  return reportButton;
}

function createCommentControls(data, commentsId, commentWrapper) {
  const controlsWrapper = document.createElement('div');
  controlsWrapper.classList.add('commentFooter');

  const replyButton = createStatefulReplyButton(data, commentWrapper, controlsWrapper);

  const reportButton = createStatefulReportButton(data, commentsId, controlsWrapper);

  controlsWrapper.appendChild(replyButton);
  controlsWrapper.appendChild(reportButton);

  return controlsWrapper;
}

function createLikeIcon(isDislike) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '1em');
  svg.setAttribute('height', '1em');
  svg.setAttribute('viewBox', '0 0 256 256');
  svg.classList.add('likeIcon');
  if (isDislike) {
    svg.classList.add('likeIcon--dis');
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('d', 'M85 177H46V84h39v93zm116.2-92h-34.7c0-.1.1-.1.1-.2 7.9-15.2 9.7-22.7 9.4-35.3-.3-12.3-11.8-23-20.6-23.1-7.3 0-10.7 7.3-12.2 11.3-4.8 12.3-7.8 23.6-24.7 46.1-.5.7-1.3 1.1-2.1 1.1h-.1c-9.5 0-17.2 7.7-17.2 17.2v58.6c0 9.5 7.7 17.2 17.2 17.2h61c8.1 0 10.6-5.4 14.6-14.6 0 0 21.3-45.8 24.3-62.6 1.4-7.9-7-15.7-15-15.7z');

  svg.appendChild(path);

  return svg;
}

function createReplyIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '1em');
  svg.setAttribute('height', '1em');
  svg.setAttribute('viewBox', '0 0 256 256');
  svg.classList.add('replyIcon');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('d', 'M240 25.5v107l-23 24H69.9l42.4 42.4-19.6 19.6-76-76L92.3 67l19.6 19.6L70 128.5h142v-103h28z');

  svg.appendChild(path);

  return svg;
}

function createArrowIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '1em');
  svg.setAttribute('height', '1em');
  svg.setAttribute('viewBox', '0 0 256 256');
  svg.classList.add('arrowIcon');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('d', 'M213 141H70.4l50.1 50.9-16.5 16.8L25.6 129 104 49.3l16.5 16.8L70.4 117H213v24z');

  svg.appendChild(path);

  return svg;
}
