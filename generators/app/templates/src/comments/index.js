import { setLineageStr, fetchComments, } from './commentsHttpService';
import initCommentForm from './commentForm';
import loadGoogleRecaptcha from './loadGoogleRecaptcha';
import initCommentList, { sortFuncs, } from './commentList';

export default function initComments() {
  const commentsWrapper = document.getElementById('comments');
  const mainFormWrapper = commentsWrapper.querySelector('.js-commentForm');
  const commentListEl = commentsWrapper.querySelector('.js-commentList');
  const commentsId = commentsWrapper.dataset.commentsId;
  const articleId = commentsWrapper.dataset.articleId;

  setLineageStr(commentsWrapper.dataset.lineageStr);

  initCommentForm({
    wrapper: mainFormWrapper,
    commentsId,
    articleId,
    isMain: true,
  });

  new IntersectionObserver(
    ([ entry, ], observer) => {
      if (entry && entry.isIntersecting) {
        loadComments();
        loadGoogleRecaptcha();
        observer.unobserve(commentsWrapper);
      }
    },
    { rootMargin: '1000px 0px', }
  ).observe(commentsWrapper);

  async function loadComments() {
    const rawCommentsData = await fetchComments(commentsId);
    const batchedCommentsData = batchCommentData(rawCommentsData.comments, rawCommentsData);

    if (batchedCommentsData.length > 0) {
      initCommentList({
        commentsData: batchedCommentsData,
        rootEl: commentListEl,

        commentsId,
      });
    }
    else {
      commentListEl.innerHTML = '';
    }
  }

  function batchCommentData(comments, allData, isSubComment = false) {
    if (!isSubComment) {
      // eslint-disable-next-line no-param-reassign
      comments = comments.slice().sort(sortFuncs.dateAsc);
    }
    return comments
      .map((comment, idx) => ({
        ...comment,
        isSubComment,
        commentsId,
        publishingDateSortable: Number(comment.publishingDateSortable),
        likesCount: allData.commentsPlusRate[comment.commentId] || 0,
        dislikesCount: allData.commentsMinusRate[comment.commentId] || 0,
        ...(Array.isArray(comment.subComments)
          ? {
            subComments: batchCommentData(comment.subComments, allData, true),
          }
          : {}),
        ...(isSubComment ? {} : { commentIdx: idx + 1, }),
      }));
  }
}
