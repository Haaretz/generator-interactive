import isEmail from 'validator/lib/isEmail';

import { createComment, signUpCommentPublishNotification, } from './commentsHttpService';
import { formTexts, } from './texts';
import { createHtzButton, } from './commonElements';

const LABEL_CLASS = 'formControl';
const INPUT_CLASS = 'formControl__input';
const PLACEHOLDER_CLASS = 'formControl__placeholder';
const INPUT_NOTE_CLASS = 'formControl__note';
// const BUTTON_CLASS = 'htzButton';
// const BUTTON_VARIANT = 'primary';

// use for single words only
const capitalize = str => {
  if (!str || typeof str !== 'string') return '';
  const firstLetter = str[0].toUpperCase();
  const restWord = str.slice(1).toLowerCase();

  return firstLetter + restWord;
};

function createCommentHtml(commentStr = '') {
  return commentStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\r\n?|\n)\s*(\r\n?|\n)/g, '$1')
    .replace(/(\r\n?|\n)/g, '<div></div>') // <br> tags are removed on the back-end. <div> tags are not.
    .replace(/\s\s/g, ' &nbsp;');
}

const validators = {
  name: v => (!v ? { valid: false, error: 'default', } : { valid: true, }),
  comment: v => (!v
    ? { valid: false, error: 'default', }
    : v.trim().replace(/(\r\n?|\n)\s*(\r\n?|\n)/g, ' ').length > 1000
      ? { valid: false, error: 'long', }
      : { valid: true, }),
  email: v => (isEmail(v) ? { valid: true, } : { valid: false, error: 'default', }),
};

const stageFields = {
  comment: [ 'name', 'comment', ],
  signup: [ 'email', ],
};

export default function initCommentForm({
  // apiService,
  wrapper = document.createElement('div'),
  articleId,
  commentsId,
  parentCommentId = 0,
  isMain = false,
  onClose = null,
}) {
  if (!isMain) {
    wrapper.classList.add('commentForm--sub');
  }

  let stage = null;
  let isBusy = false;
  // let destroyed = false;

  let createdCommentId = null;
  let createdCommentHash = null;

  let callbacksBeforeNextStage = [];

  const stagesState = {
    comment: {
      el: null,
      name: {
        value: '',
        dom: null,
        error: null,
      },
      comment: {
        value: '',
        dom: null,
        error: null,
      },
    },
    signup: {
      el: null,
      email: {
        value: '',
        dom: null,
        error: null,
      },
    },
    error: {
      el: null,
    },
    // success: {
    //   el: null,
    // },
  };

  const resetStage = () => {
    if (!stage) return;

    const stageState = stagesState[stage];

    stageFields[stage] && stageFields[stage].forEach(field => {
      stageState[field].value = '';
      stageState[field].dom.reset();
    });
  };

  const validate = field => validators[field](stagesState[stage][field].value);

  const setBusy = (nextBusyState, formEl) => {
    if (nextBusyState === isBusy) return;

    isBusy = nextBusyState;
    formEl.elements.submit
     && formEl.elements.submit.classList[isBusy ? 'add' : 'remove']('htzButton--busy');
    formEl.elements.cancel
     && formEl.elements.cancel[isBusy ? 'setAttribute' : 'removeAttribute']('disabled', 'true');
  };

  const initStage = (nextStage, resetPreviousStage) => {
    callbacksBeforeNextStage.forEach(cb => typeof cb === 'function' && cb());
    callbacksBeforeNextStage = [];

    if (resetPreviousStage) {
      resetStage();
    }

    const prevStage = stage;
    stage = nextStage;

    const isFormStage = [ 'comment', 'signup', ].includes(stage);

    const stageState = stagesState[stage];

    stageState.el = isMain && prevStage == null
      ? wrapper.querySelector('form')
      : (stageState.el || createStageEl(stage, !isMain));

    if (!stageState.el) {
      // console.error(`Something went wrong inside the comment form in stage ${stage}`);
      close();
    }

    stageState.el.classList.add(`commentForm__stage--${stage}`);

    if (isFormStage) {
      stageFields[stage].forEach(field => {
        stageState[field].dom = stageState[field].dom || getDomState(field, stageState.el);
      });
    }

    setupStageListeners(stageState.el);

    if (prevStage == null) {
      if (!isMain) {
        wrapper.appendChild(stageState.el);
        const firstField = stageFields[stage][0];
        stageState[firstField].dom.input.focus();
      }
    }
    else {
      wrapper.replaceChild(stageState.el, stagesState[prevStage].el);
      if (stage === 'signup' || (stage === 'comment' && prevStage === 'error')) {
        const firstField = stageFields[stage][0];
        stageState[firstField].dom.input.focus();
      }
      else {
        stageState.el.focus();
      }
    }
  };

  function submitHandler(evt) {
    evt.preventDefault();

    if (isBusy) {
      return;
    }

    const stageState = stagesState[stage];
    const invalidFields = [];
    stageFields[stage].forEach(field => {
      const { valid, error, } = validate(field);
      if (!valid) {
        invalidFields.push({ field, error: error || 'default', });
      }
    });

    if (invalidFields.length > 0) {
      invalidFields.forEach(({ field, error, }, i) => {
        const { setError, input, } = stageState[field].dom;
        setError(error);
        if (i === 0) {
          input.focus();
        }
      });
    }
    else {
      switch (stage) {
        case 'comment':
          setBusy(true, evt.target);
          createComment({
            commentsId,
            articleId,
            parentCommentId,
            name: stageState.name.value,
            comment: createCommentHtml(stageState.comment.value),
          })
            .then(({ newCommentId, hash, }) => {
              createdCommentId = newCommentId;
              createdCommentHash = hash;

              initStage('signup', true);
            })
            .catch(err => {
              initStage('error', false);
            })
            .finally(() => {
              setBusy(false, evt.target);
            });
          break;
        case 'signup':
          setBusy(true, evt.target);
          signUpCommentPublishNotification({
            email: stageState.email.value,
            commentId: createdCommentId,
            commentHash: createdCommentHash,
          })
            .then(res => {
              // signup success
            })
            .catch(err => {
              // singup error (problems with cors - produces false negatives)
            })
            .finally(() => {
              // treating each of this calls as successful for now
              createdCommentId = null;
              createdCommentHash = null;

              setBusy(false, evt.target);

              if (isMain) {
                initStage('comment');
              }
              else {
                close();
              }
            });
          break;
        default:
          console.warn('unknown stage', stage);
      }
    }
  }

  function backToCommentForm() {
    initStage('comment');
  }

  function setupStageListeners(el) {
    switch (stage) {
      case 'comment':
        return setupFormListeners(el);
      case 'signup':
        return setupSignupStageListeners(el);
      case 'error':
        return setupErrorStageListeners(el);
      default:
        return null;
    }
  }

  function setupFormListeners(formEl) {
    const stageState = stagesState[stage];
    formEl.addEventListener('submit', submitHandler);
    callbacksBeforeNextStage.push(() => {
      formEl.removeEventListener('submit', submitHandler);
    });

    const cancelButton = formEl.elements.cancel;
    if (cancelButton) {
      cancelButton.addEventListener('click', close);
      callbacksBeforeNextStage.push(() => {
        cancelButton.removeEventListener('click', close);
      });
    }

    stageFields[stage].forEach(field => {
      const fieldState = stageState[field];
      const { input, setActive, setEmpty, setError, isValid, clearError, } = fieldState.dom;

      let touched = false;

      const handleInput = evt => {
        fieldState.value = input.value.trim();
        setEmpty(!fieldState.value);
        if (touched) {
          const { valid, error, } = validate(field);
          setError(valid ? null : (error || 'default'));
        }
        else if (!isValid()) {
          clearError();
        }
      };

      const handleBlur = evt => {
        input.value = fieldState.value;
        input.removeEventListener('input', handleInput);
        input.removeEventListener('blur', handleBlur);

        const { valid, error, } = validate(field);
        touched = true;
        setError(valid ? null : (error || 'default'));
        setActive(false);
      };

      const handleFocus = evt => {
        setActive(true);

        input.addEventListener('input', handleInput);
        input.addEventListener('blur', handleBlur);
      };

      input.addEventListener('focus', handleFocus);

      callbacksBeforeNextStage.push(() => {
        input.removeEventListener('input', handleInput);
        input.removeEventListener('blur', handleBlur);
        input.removeEventListener('focus', handleFocus);
      });
    });
  }

  function setupSignupStageListeners(el) {
    setupFormListeners(el);
    const closeButton = el.querySelector('.js-closeButton');
    const handleClose = () => {
      if (isBusy) return;

      if (isMain) {
        backToCommentForm();
      }
      else {
        close();
      }
    };

    closeButton.addEventListener('click', handleClose);

    callbacksBeforeNextStage.push(() => {
      closeButton.removeEventListener('click', handleClose);
    });
  }

  function setupErrorStageListeners(el) {
    const backButtons = [ ...el.querySelectorAll('.js-errorBackButton'), ];

    backButtons.forEach(button => {
      button.addEventListener('click', backToCommentForm);
    });

    callbacksBeforeNextStage.push(() => {
      backButtons.forEach(button => {
        button.removeEventListener('click', backToCommentForm);
      });
    });
  }

  function close() {
    callbacksBeforeNextStage.forEach(cb => typeof cb === 'function' && cb());
    wrapper.parentElement.removeChild(wrapper);
    typeof onClose === 'function' && onClose();
  }

  initStage('comment');

  return close;
}

function getDomState(field, formEl) {
  const input = formEl.querySelector(`[name="${field}"]`);
  const label = formEl.querySelector(`label[data-for="${field}"]`);
  // const placeholder = wrapper.querySelector(`.formControl__placeholder[data-for="${field}"]`);
  const note = formEl.querySelector(`.formControl__note[data-for="${field}"]`);

  let isActive = false;
  let isValidState = true;
  let isEmpty = true;
  let error = null;
  const setActive = nextIsActive => {
    if (nextIsActive === isActive) {
      return;
    }
    isActive = nextIsActive;

    label.classList[isActive ? 'add' : 'remove']('formControl--active');
  };

  const setEmpty = nextIsEmpty => {
    if (nextIsEmpty === isEmpty) {
      return;
    }
    isEmpty = nextIsEmpty;

    label.classList[isEmpty ? 'remove' : 'add']('formControl--hasValue');
  };

  const setIsValid = nextIsValid => {
    if (nextIsValid === isValidState) {
      return;
    }
    isValidState = nextIsValid;

    label.classList[isValidState ? 'remove' : 'add']('formControl--invalid');
  };

  const clearError = () => {
    if (error == null) {
      return;
    }
    error = null;
    setIsValid(true);
    note.textContent = formTexts[field].note.initial;
  };

  const setError = errorType => {
    if (!errorType) {
      clearError();
      return;
    }
    if (error === errorType) {
      return;
    }
    error = errorType;
    setIsValid(false);
    note.textContent = formTexts[field].note[`error${capitalize(errorType)}`];
  };

  const isValid = () => isValidState;

  const reset = () => {
    input.value = '';
    clearError();
    setEmpty(true);
    setActive(false);
  };

  return {
    input,
    setActive,
    setEmpty,
    setError,
    clearError,
    isValid,
    reset,
  };
}

function createStageEl(stage, isSubComment) {
  let el = null;
  switch (stage) {
    case 'comment':
      el = document.createElement('form');
      el.setAttribute('novalidate', 'true');
      appendFormControls({ stage, formEl: el, withCancelButton: isSubComment, });
      return el;
    case 'signup':
      return createSignupStageEl();
    case 'error':
      return createErrorStageEl();
    default:
      return null;
  }
}

function createErrorStageEl() {
  const el = document.createElement('div');
  el.setAttribute('tabindex', '-1');

  [ formTexts.submitError, formTexts.tryAgain, ].forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    el.appendChild(p);
  });

  const backButton = createHtzButton({
    text: formTexts.back,
    type: 'button',
    extraClasses: [ 'js-errorBackButton', 'formButton', ],
  });
  el.appendChild(backButton);

  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('js-errorBackButton', 'xButton');
  closeButton.innerHTML = '&times;';
  el.appendChild(closeButton);

  return el;
}

function createSignupStageEl() {
  const el = document.createElement('form');
  el.setAttribute('novalidate', 'true');
  // el.setAttribute('tabindex', '-1');

  const firstLine = document.createElement('p');
  const boldText = document.createElement('strong');
  boldText.textContent = formTexts.submitSuccessBold;
  const restFirstLine = document.createTextNode(formTexts.submitSuccessAfterBold);
  firstLine.appendChild(boldText);
  firstLine.appendChild(restFirstLine);

  const secondLine = document.createElement('p');
  secondLine.textContent = formTexts.submitSuccessGetNotified;

  el.appendChild(firstLine);
  el.appendChild(secondLine);

  appendFormControls({ formEl: el, stage: 'signup', });

  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('js-closeButton', 'xButton');
  closeButton.innerHTML = '&times;';
  el.appendChild(closeButton);

  return el;
}

function appendFormControls({ formEl, stage, withCancelButton = false, }) {
  stageFields[stage].forEach(field => {
    createInputEls({
      field,
      isTextArea: field === 'comment',
      type: field === 'email' ? 'email' : 'text',
      maxlength: field === 'name' ? 50 : null,
    })
      .forEach(el => {
        formEl.appendChild(el);
      });
  });

  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.classList.add('commentForm__buttons');

  if (withCancelButton) {
    const cancelButton = createHtzButton({
      text: formTexts.cancel,
      type: 'button',
      variant: 'negative',
      extraClasses: [ 'formButton', ],
    });
    cancelButton.setAttribute('name', 'cancel');
    buttonsWrapper.appendChild(cancelButton);
  }

  const submitButton = createHtzButton({
    text: formTexts[`submit${capitalize(stage)}`],
    type: 'submit',
    extraClasses: [ 'formButton', ],
  });
  submitButton.setAttribute('name', 'submit');
  buttonsWrapper.appendChild(submitButton);

  formEl.appendChild(buttonsWrapper);
}

const getNoteId = (() => {
  let uniqeInt = 0;
  return () => {
    uniqeInt += 1;
    return `commentForm__commentNote-${uniqeInt}`;
  };
})();
function createInputEls({ field, isTextArea, type, maxlength, }) {
  const noteId = getNoteId();

  const placeholder = document.createElement('span');
  placeholder.classList.add(PLACEHOLDER_CLASS);
  placeholder.dataset.for = field;
  placeholder.textContent = formTexts[field].placeholder;

  const input = document.createElement(isTextArea ? 'textarea' : 'input');
  input.name = field;
  input.setAttribute('aria-describedby', noteId);
  input.setAttribute('type', type);
  input.setAttribute('required', true);
  if (maxlength != null) {
    input.setAttribute('maxlength', `${maxlength}`);
  }
  input.classList.add(INPUT_CLASS);

  const label = document.createElement('label');
  label.dataset.for = field;
  label.classList.add(LABEL_CLASS);
  label.appendChild(placeholder);
  label.appendChild(input);

  const noteEl = document.createElement('span');
  noteEl.id = noteId;
  noteEl.dataset.for = field;
  noteEl.classList.add(INPUT_NOTE_CLASS);
  noteEl.textContent = formTexts[field].note.initial;

  return [ label, noteEl, ];
}
