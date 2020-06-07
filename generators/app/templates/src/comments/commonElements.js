export const BUTTON_CLASS = 'htzButton';
export const BUTTON_CONTENT_CLASS = `${BUTTON_CLASS}__content`;

export function createHtzButton({ text = '', type = 'button', variant = 'primary', extraClasses = [], }) {
  const button = document.createElement('button');
  button.setAttribute('type', type);
  const classes = [ BUTTON_CLASS, `${BUTTON_CLASS}--${variant}`, ...extraClasses, ];
  button.classList.add(...classes);

  const contentEl = document.createElement('span');
  contentEl.classList.add(BUTTON_CONTENT_CLASS);
  contentEl.textContent = text;

  const progressEl = document.createElement('span');
  progressEl.classList.add(`${BUTTON_CLASS}__progress`);

  button.appendChild(contentEl);
  button.appendChild(progressEl);

  return button;
}
