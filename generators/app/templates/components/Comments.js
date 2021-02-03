import { useFela, } from 'react-fela';
import * as React from 'react';
import { parseStyleProps, } from '@haaretz/htz-css-tools';

import { useData, } from './DataContext';
import H from './H';
import Section from './Section';
import IconHtzLoader from './IconHtzLoader';

const i18n = {
  he: {
    sectionHead: 'תגובות',

    nameLabel: 'שם',
    nameNoteInitial: 'הזינו שם שיוצג באתר',
    nameNoteError: 'חובה להזין שם',

    commentLabel: 'תגובה',
    commentNoteInitial: 'משלוח תגובה מהווה הסכמה לתנאי השימוש של אתר הארץ',
    commentNoteError: 'נא להזין את תוכן התגובה',

    formSubmit: 'שלחו',
  },
  en: {
    sectionHead: 'Comments',
    nameLabel: 'Name',
    nameNoteInitial: 'Enter the commenter display name',
    nameNoteError: 'Name is required',

    commentLabel: 'Comment',
    commentNoteInitial: 'By adding a comment, I agree to this site’s Terms of use',
    commentNoteError: 'Comment is required',

    formSubmit: 'Send',
  },
};

const commentSectionStyles = ({ theme, miscStyles, }) => ({
  marginTop: '6rem',
  borderTop: `2px solid ${theme.color('commentPrimary')}`,
  paddingTop: 'calc(2rem - 2px)',
  paddingInlineStart: '2rem',
  paddingInlineEnd: '2rem',

  extend: [
    theme.mq({ from: 'l', }, {
      display: 'grid',
      gridTemplateColumns: '30rem 1fr',
      paddingTop: 'calc(4rem - 2px)',
      paddingInlineStart: '0',
      paddingInlineEnd: '0',
    }),
    ...(miscStyles ? parseStyleProps(miscStyles, theme.mq, theme.type) : []),
  ],

  '& .commentForm--sub': {
    marginTop: '2.5rem',
  },

  '& .commentForm--doubleSub': {
    gridColumnEnd: 'span 2',
  },

  '& .commentForm__stage--comment': {
    '& .commentForm__buttons': {
      justifyContent: 'flex-end',
    },
  },

  '& .commentForm__stage--signup': {
    outline: 'none',
    position: 'relative',
    backgroundColor: theme.color('commentPrimary', '-3'),
    borderBottom: `1px solid ${theme.color('commentPrimary', '1')}`,
    padding: '8.2rem 4rem calc(8.2rem - 1px)',

    '& .formControl': {
      marginTop: '4rem',
      backgroundColor: theme.color('commentSecondary', '-4'),
    },

    '& .commentForm__buttons': {
      margin: '3rem 0 0',
    },
  },

  '& .xButton': {
    position: 'absolute',
    top: '0',
    end: '0',
    padding: '1rem 1.5rem',
    fontSize: '4rem',

    '&:active': {
      outline: 'none',
    },
  },

  '& .commentForm__stage--error': {
    outline: 'none',
    position: 'relative',
    backgroundColor: theme.color('commentPrimary', '-3'),
    borderBottom: `1px solid ${theme.color('commentPrimary', '1')}`,
    padding: '8.2rem 4rem calc(8.2rem - 1px)',
    textAlign: 'center',

    '& p': {
      marginBottom: '1rem',

      '&:last-of-type': {
        fontWeight: 700,
      },
    },

    '& .formButton': {
      margin: '4rem auto 0',
    },
  },

  '& label.formControl': {
    position: 'relative',
    display: 'block',
    border: `1px solid ${theme.color('commentPrimary', '-2')}`,
    backgroundColor: theme.color('commentPrimary', '-3'),
    padding: 'calc(1rem - 1px) 1rem',

    '&:not(:first-of-type)': {
      marginTop: '4rem',
    },

    '& .formControl__placeholder': {
      position: 'absolute',
      marginInlineStart: '-1rem',
      marginTop: '-0.5rem',
      padding: '0.5rem 1rem 0',
      color: theme.color('commentPrimary', '1'),
      fontWeight: 700,
      transition: 'transform 0.1666s',
    },

    '& .formControl__input': {
      outline: 'none',
      width: '100%',
      backgroundColor: 'transparent',
    },

    '& textarea.formControl__input': {
      resize: 'none',
      display: 'block',
      height: '14rem',
      overflow: 'auto',
    },

    '&+.formControl__note': {
      color: theme.color('commentSecondary', '-1'),
      extend: [
        theme.type(-2, { lines: 4, }),
      ],
    },

    '&.formControl--active': {
      backgroundColor: theme.color('commentSecondary', '-4'),
      borderColor: theme.color('commentPrimary'),

      '&.formControl--invalid': {
        borderColor: theme.color('commentNegative'),
      },
      '& .formControl__placeholder': {
        backgroundColor: 'inherit',
        transform: 'translateY(-3.3rem) scale(0.8)',
      },
    },

    '&.formControl--hasValue': {
      '& .formControl__placeholder': {
        backgroundColor: 'inherit',
        transform: 'translateY(-3.3rem) scale(0.8)',
      },
    },

    '&.formControl--invalid': {
      '& .formControl__placeholder': {
        color: theme.color('commentNegative'),
      },
      '&+.formControl__note': {
        color: theme.color('commentNegative'),
      },
    },
  },

  '& .commentForm__buttons': {
    marginTop: '1rem',
    display: 'flex',

    '& .formButton:not(:last-of-type)': {
      marginInlineEnd: '2rem',
    },
  },

  '& .formButton': {
    display: 'block',
    padding: 'calc(0.5rem - 1px) 5rem',
  },

  '& .htzButton': {
    position: 'relative',
    outline: 'none',
    border: '1px solid currentColor',
    fontWeight: 700,
    transition: `${theme.getTransitionString(
      'all',
      -1,
      'swiftIn'
    )}, ${theme.getTransitionString(
      'transform',
      1,
      'swiftOut',
      1
    )}, ${theme.getTransitionString(
      'backgroundColor',
      0,
      'swiftIn',
      undefined
    )}`,

    '&:disabled': {
      opacity: '0.4',
    },

    '& .htzButton__content': {
      transitionProperty: 'opacity',
      ...theme.getTransition(-1, 'swiftOut', 1),
    },

    '& .htzButton__progress': {
      position: 'absolute',
      top: '0',
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(200,200,200,0.3)',
      insetInlineStart: '0',
      transformOrigin: 'logical start',
      transform: 'scaleX(0)',

      animationDirection: 'alternate',
      animationIterationCount: 'infinite',
      ...theme.getDuration('animation', 4),
      ...theme.getDelay('animation', 3),
    },

    '&.htzButton--busy.htzButton--busy': {
      cursor: 'not-allowed',
      pointerEvents: 'none',
      transform: 'scale(0.8, 0.4)',
      borderColor: 'rgba(255,255,255,0)',
      transition: `${theme.getTransitionString(
        'all',
        -1,
        'swiftIn'
      )}, ${theme.getTransitionString(
        'transform',
        1,
        'swiftOut',
        1
      )}, ${theme.getTransitionString(
        'backgroundColor',
        0,
        'swiftIn',
        0
      )}`,

      '&.htzButton--primary': {
        backgroundColor: theme.color('commentPrimary'),
      },

      '&.htzButton--negative': {
        backgroundColor: theme.color('commentNegative'),
      },

      '& .htzButton__content': {
        opacity: 0,
        ...theme.getTransition(-1, 'swiftOut'),
      },

      '& .htzButton__progress': {
        animationName: {
          '0%': { transform: 'scaleX(0)', },
          '100%': { transform: 'scaleX(1)', },
        },
      },
    },

    '&.htzButton--primary': {
      color: theme.color('commentPrimary'),

      '&:focus': {
        backgroundColor: theme.color('commentPrimary'),
        color: theme.color('commentSecondary', '-4'),
      },

      '&:active': {
        backgroundColor: theme.color('commentPrimary', '-3'),
        color: theme.color('commentPrimary', '1'),
      },

      '&:hover': {
        backgroundColor: theme.color('commentPrimary', '-1'),
        color: theme.color('commentPrimary', '1'),
      },
    },

    '&.htzButton--negative': {
      color: theme.color('commentNegative'),

      '&:focus': {
        backgroundColor: theme.color('commentNegative'),
        color: theme.color('commentSecondary', '-4'),
      },

      '&:hover': {
        backgroundColor: theme.color('commentNegative', '-1'),
        color: theme.color('commentNegative', '1'),
      },
    },
  },

  '& .commentSort': {
    gridColumnStart: '2',
    margin: '2rem 0 5rem',
    borderTop: `1px solid ${theme.color('commentSecondary', '-3')}`,
    display: 'flex',
    alignItems: 'flex-end',
    paddingTop: '2rem',
    color: theme.color('commentSecondary'),

    '& .commentSort__select': {
      position: 'relative',
      color: theme.color('commentPrimary'),

      '&:after': {
        content: '""',
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 1,
        top: '50%',
        end: '1rem',
        transform: 'translateY(-50%)',
        borderWidth: '0.5em 0.3em 0',
        borderColor: 'currentColor transparent transparent',
        borderStyle: 'solid',
      },

      '& select': {
        backgroundColor: theme.color('commentSecondary', '-4'),
        border: '1px solid currentColor',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        paddingInlineStart: '1rem',
        paddingInlineEnd: '5rem',
        marginInlineStart: '2.3rem',
      },
    },
  },

});

const sectionHeadStyles = ({ theme, }) => ({
  fontWeight: 700,
  color: theme.color('commentPrimary'),
  extend: [
    theme.mq({ until: 'l', }, {
      marginBottom: '2rem',
      ...theme.type(1),
    }),
    theme.mq({ from: 'l', }, {
      paddingInlineStart: '2rem',
      ...theme.type(4),
      lineHeight: 1,
    }),
  ],
});

const commentListStyles = ({ theme, isRtl, }) => ({
  gridColumnStart: 2,

  '& .comment': {
    marginTop: '2rem',
    display: 'grid',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  },

  '&>.comment': {
    borderBottom: `1px solid ${theme.color('commentSecondary', '-3')}`,
    paddingInlineStart: '1rem',
    paddingInlineEnd: '1rem',
    paddingBottom: 'calc(2rem - 1px)',
    gridTemplateColumns: '8.5rem 1fr',

    '&:first-of-type': {
      marginTop: 0,
    },
    '&:last-of-type': {
      borderColor: 'transparent',
    },
  },

  '&>.comment>.commentIdx': {
    color: theme.color('commentSecondary', '-1'),
    ...theme.type(3),
    ...theme.mq({ from: 'xl', }, theme.type(4)),

    '&.commentIdx--tri': {
      ...theme.type(3),
    },
    '&.commentIdx--quad': {
      ...theme.type(1),
    },
  },

  '& .comment--sub': {
    borderBottom: `1px solid ${theme.color('commentPrimary', '-2')}`,
    gridTemplateColumns: '6rem 1fr',

    '&:last-child': {
      borderBottom: 'none',
    },

    '& .replyIcon': {
      color: theme.color('commentSecondary', '-3'),
      fontSize: '4rem',
      lineHeight: 1,
      transform: isRtl ? 'none' : 'scale(-1, 1)',
    },
  },

  '& .commentAuthor': {
    unicodeBidi: 'isolate',
    display: 'inline',
    color: theme.color('commentPrimary'),
    fontWeight: 700,
  },

  '& .commentDate': {
    marginInlineStart: '1rem',
    marginInlineEnd: '1rem',
    color: theme.color('commentSecondary', '-1'),
    extend: [
      theme.type(-1),
    ],
  },

  '& .commentParentAuthor': {
    color: theme.color('commentSecondary', '-3'),
    fontStyle: 'italic',

    '& .arrowIcon': {
      verticalAlign: '-0.15em',
      transform: isRtl ? 'none' : 'scale(-1, 1)',
    },
  },

  '& .commentLikeButtons': {
    marginTop: '1rem',
    marginBottom: '1rem',

    '&>button': {
      color: theme.color('commentPrimary'),
      marginInlineEnd: '3rem',

      '&:active': {
        outline: 'none',
      },
      '&:disabled': {
        color: theme.color('commentSecondary', '-2'),
        cursor: 'default',
      },
    },

    '& .likeIcon': {
      marginInlineEnd: '1rem',
      fontSize: '4rem',
      lineHeight: 1,

      '&.likeIcon--dis': {
        transform: 'scale(-1,-1)',
      },
    },

    '& .likesCount': {
      color: theme.color('commentSecondary', '-2'),
      fontWeight: 700,
      extend: [
        theme.type(-2),
      ],
    },

  },

  '& .commentContent': {
    color: theme.color('commentSecondary'),
  },

  '& .commentFooter': {
    marginTop: '1rem',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'baseline',

    '& .commentReportWidget': {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
    },
  },

  '& .commentReply': {
    border: 'none',
    padding: '1rem',
  },

  '& .commentReport': {
    // marginInlineEnd: '-1rem',
    border: 'none',
    padding: '1rem',
    extend: [
      theme.type(-2),
    ],
  },

  '& .commentMoreButton': {
    display: 'block',
    margin: '3rem auto 0',
    padding: 'calc(1rem - 1px) 4rem',
  },
});

export default function Comments({ miscStyles, }) {
  const commentsContentId = useData('commentsContentId');
  const site = useData('site');
  const articleId = useData('articleId');
  const lineage = useData('lineage');

  const lineageStr = (
    lineage && lineage
      .slice()
      .reverse()
      .reduce((pathFragment, item) => `${pathFragment}%2F${item.contentId}`, '')
  ) || articleId;

  const lang = site === 'haaretz.com' ? 'en' : 'he';
  const texts = i18n[lang];

  const isRtl = site !== 'haaretz.com';
  const { css, } = useFela({ miscStyles, isRtl, });

  const commentSectionClasses = css(commentSectionStyles);
  const sectionHeadClasses = css(sectionHeadStyles);
  const inputLabelClasses = 'formControl';
  const inputPlaceholderClasses = 'formControl__placeholder';
  const inputClasses = 'formControl__input';
  const inputNoteClasses = 'formControl__note';
  const submitButtonClasses = 'formButton htzButton htzButton--primary';
  const commentsLoaderClasses = `${css({
    gridColumnStart: 2,
    padding: '10rem 2rem',
    display: 'flex',
    justifyContent: 'center',
  })} js-commentLoader`;
  const commentListClasses = `${css(commentListStyles)} js-commentList`;

  return (
    <Section
      id="comments"
      className={commentSectionClasses}
      data-comments-id={commentsContentId}
      data-article-id={articleId}
      data-lineage-str={lineageStr}
    >
      <H className={sectionHeadClasses}>{texts.sectionHead}</H>
      <div className="js-commentForm">
        <form className="commentForm__stage--comment" noValidate>
          <label className={inputLabelClasses} htmlFor="commentForm__name" data-for="name">
            <span className={inputPlaceholderClasses} data-for="name">{texts.nameLabel}</span>
            <input
              id="commentForm__name"
              name="name"
              aria-describedby="commentForm__nameNote"
              type="text"
              maxLength="50"
              required
              className={inputClasses}
            />
          </label>
          <div className={inputNoteClasses} id="commentForm__nameNote" data-for="name">{texts.nameNoteInitial}</div>

          <label className={inputLabelClasses} htmlFor="commentForm__comment" data-for="comment">
            <span className={inputPlaceholderClasses} data-for="comment">{texts.commentLabel}</span>
            <textarea
              id="commentForm__comment"
              name="comment"
              aria-describedby="commentForm__commentNote"
              required
              className={inputClasses}
            />
          </label>
          <div className={inputNoteClasses} id="commentForm__commentNote" data-for="comment">{texts.commentNoteInitial}</div>

          <div className="commentForm__buttons">
            <button
              type="submit"
              name="submit"
              className={submitButtonClasses}
            >
              <span className="htzButton__content">
                {texts.formSubmit}
              </span>
              <span className="htzButton__progress" />
            </button>
          </div>
        </form>
      </div>

      <div className={commentListClasses}>
        <div className={commentsLoaderClasses}>
          <IconHtzLoader size={10} color="commentPrimary" />
        </div>
      </div>
    </Section>
  );
}
