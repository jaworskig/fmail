const {
  SET_EMAILS,
  SET_LAST_EMAIL_OFFSET,
  SET_TOTAL_NUMBER_OF_EMAILS
} = require("./inboxEvents");

const initState = {
  emails: [],
  totalNumberOfEmails: 0,
  emailOffset: 0
};

const inboxReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_LAST_EMAIL_OFFSET:
      return Object.assign({}, state, { emailOffset: action.value });

    case SET_TOTAL_NUMBER_OF_EMAILS:
      return Object.assign({}, state, { totalNumberOfEmails: action.value });

    case SET_EMAILS:
      return Object.assign({}, state, { emails: action.value });

    default:
      return state;
  }
};

module.exports = inboxReducer;
