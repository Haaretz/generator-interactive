import createComment from './createComment';
import { createHtzButton, } from './commonElements';
import texts from './texts';

export const sortFuncs = {
  dateDesc: (a, b) => b.publishingDateSortable - a.publishingDateSortable,
  dateAsc: (a, b) => a.publishingDateSortable - b.publishingDateSortable,
};

export default function commentList({
  commentsData: sortedCommentsData,
  rootEl,

  commentsId, // consider passing a function instead
}) {
  const idToEl = {};
  let sortBy = 'dateDesc';
  let maxDisplayedCount = 20;
  let commentsToDisplay = null;

  let displayMoreButton = null;

  initSortingElement();

  if (maxDisplayedCount < sortedCommentsData.length) {
    displayMoreButton = createDisplayMoreButton();
    displayMoreButton.addEventListener('click', displayMore);
  }

  sortAndDisplayComments();

  function displayMore() {
    maxDisplayedCount += 20;
    const commentsToAppend = sortedCommentsData.slice(commentsToDisplay.length, maxDisplayedCount);
    commentsToDisplay = commentsToDisplay.concat(commentsToAppend);
    const fragment = createCommentsFragment(commentsToAppend);

    if (maxDisplayedCount < sortedCommentsData.length) {
      fragment.appendChild(displayMoreButton);
    }
    else {
      rootEl.removeChild(displayMoreButton);
      displayMoreButton.removeEventListener('click', displayMore);
      displayMoreButton = null;
    }

    rootEl.appendChild(fragment);
  }

  function sortAndDisplayComments() {
    commentsToDisplay = sortedCommentsData
      .sort(sortFuncs[sortBy])
      .slice(0, maxDisplayedCount);

    const fragment = createCommentsFragment(commentsToDisplay);
    if (displayMoreButton) {
      fragment.appendChild(displayMoreButton);
    }

    // eslint-disable-next-line no-param-reassign
    rootEl.innerHTML = '';
    rootEl.appendChild(fragment);
  }

  function createCommentsFragment(comments) {
    const fragment = new DocumentFragment();
    comments
      .forEach(comment => {
        const { commentId, } = comment;
        if (!idToEl[commentId]) {
          idToEl[commentId] = createComment({ data: comment, commentsId, });
        }
        fragment.appendChild(idToEl[commentId]);
      });

    return fragment;
  }

  function initSortingElement() {
    const wrappingLabel = document.createElement('label');
    wrappingLabel.classList.add('commentSort');

    const select = document.createElement('select');
    [ 'dateDesc', 'dateAsc', ].forEach(sortOption => {
      const option = document.createElement('option');
      option.value = sortOption;
      option.textContent = texts[sortOption];

      select.appendChild(option);
    });

    select.addEventListener('change', evt => {
      if (sortBy !== select.value) {
        sortBy = select.value;
        sortAndDisplayComments();
      }
    });

    const selectWrapper = document.createElement('div');
    selectWrapper.classList.add('commentSort__select');
    selectWrapper.appendChild(select);

    wrappingLabel.appendChild(document.createTextNode(texts.sort));
    wrappingLabel.appendChild(selectWrapper);

    rootEl.parentElement.insertBefore(wrappingLabel, rootEl);
  }
}

function createDisplayMoreButton(displayMore) {
  const button = createHtzButton({
    text: texts.moreComments,
    extraClasses: [ 'commentMoreButton', ],
  });

  button.addEventListener('click', displayMore);

  return button;
}
