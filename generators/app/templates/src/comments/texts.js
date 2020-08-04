export default {<% if (langCode === 'he') { %>
  like: 'אהבתי',
  dislike: 'לא אהבתי',
  reply: 'הגיבו',
  report: 'דווחו כפוגעני',
  reportFail: 'אירעה שגיאה, נסו שוב',
  reportSuccess: 'הדיווח התקבל',
  isReply: 'תגובה לתגובה',
  cancel: 'בטלו',
  moreComments: 'עוד תגובות',
  dateDesc: 'מהאחרונה לראשונה',
  dateAsc: 'מהראשונה לאחרונה',
  sort: 'סדרו את התגובות',<% } else { %>like: 'Like',
  dislike: 'Dislike',
  reply: 'Reply',
  report: 'Report',
  reportFail: 'Try again',
  reportSuccess: 'Report received',
  isReply: 'Reply to comment',
  cancel: 'Cancel',
  moreComments: 'Load More',
  dateDesc: 'Newest first',
  dateAsc: 'Oldest first',
  sort: 'Sort comments by',
<% { %>};

export const formTexts = {<% if (langCode === 'he') { %>
  name: {
    placeholder: 'שם',
    note: {
      initial: 'הזינו שם שיוצג באתר',
      errorDefault: 'חובה להזין שם',
    },
  },
  comment: {
    placeholder: 'תגובה',
    note: {
      initial: 'משלוח תגובה מהווה הסכמה לתנאי השימוש של אתר הארץ',
      errorDefault: 'נא להזין את תוכן התגובה',
      errorLong: 'אין להזין יותר מ-1,000 תווים בתוכן התגובה',
    },
  },
  email: {
    placeholder: 'דוא"ל',
    note: {
      initial: 'הזינו כתובת דוא"ל לקבלת התראות',
      errorDefault: 'נא להזין כתובת דוא"ל תקינה',
    },
  },
  submitComment: 'שלחו',
  submitSignup: 'עדכנו אותי',
  submitError: 'משהו השתבש והתגובה לא נקלטה במערכת שלנו.',
  tryAgain: 'שננסה שוב?',
  back: 'חזרה',
  cancel: 'בטלו',
  submitSuccessBold: 'תגובתך נקלטה בהצלחה,',
  submitSuccessAfterBold: ' ותפורסם על פי מדיניות המערכת',
  submitSuccessGetNotified: 'באפשרותך לקבל התראה בדוא"ל כאשר תגובתך תאושר ותפורסם.',<% } else { %>name: {
    placeholder: 'Name',
    note: {
      initial: 'Enter the commenter display name',
      errorDefault: 'Name is required',
    },
  },
  comment: {
    placeholder: 'Comment',
    note: {
      initial: 'By adding a comment, I agree to this site’s Terms of use',
      errorDefault: 'Comment is required',
      errorLong: 'Comment max length is 1,000 chars',
    },
  },
  email: {
    placeholder: 'Email',
    note: {
      initial: 'Please enter a valid email address',
      errorDefault: 'Please enter a valid email address',
    },
  },
  submitComment: 'Send',
  submitSignup: 'Keep me posted',
  submitError:
    'Something went wrong and your comment was not submitted to our site',
  tryAgain: 'Try again?',
  back: 'Back',
  cancel: 'Cancel',
  submitSuccessBold: 'Your comment was succesfully submitted',
  submitSuccessAfterBold:
    ' and will be published in accordance with site policy.',
  submitSuccessGetNotified:
    'If you would like to be notified when your comment is published, please fill in your email address in the form below',
<% { %>};
