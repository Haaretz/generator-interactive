import { createRenderer, } from '@haaretz/fela-utils';

export default function getFelaRenderer() {
  const styleRenderer = createRenderer({ isRtl: '<%= langCode === "he" ? "rtl" : "ltr" %>', });
  return styleRenderer;
}
