const { connect } = require("react-redux");
const fetchEmails = require("./utils/fetchEmails")(window.fetch);
const Paths = require("../../config/paths");
const { ShowAlert } = require("../alert/alertActions");
const EmailOverview = require("../navigationBar/components/navigationList/EmailOverview");
const pathnameToEmailType = require("./utils/pathnameToEmailType");
const { EMAIL_LIMIT } = require("./config");
const {
  SetEmailOverview
} = require("../navigationBar/components/navigationList/navigationListActions");
const {
  SetEmails,
  SetTotalNumberOfEmails,
  SetLastEmailOffset
} = require("./inboxActions");
const timestampSort = require("./utils/timestampSort");
const InboxEmail = require("./utils/InboxEmail");
const {
  SetLocation
} = require("../navigationBar/components/navigationList/navigationListActions");
const Inbox = require("./Inbox");

const mapStateToProps = state => {
  return {
    pathname: state.navigationList.pathname,
    emails: state.inbox.emails,
    emailOffset: state.inbox.emailOffset
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchEmails: async (lastPathname, pathname, emailOffset) => {
      dispatch(SetLocation(pathname));
      try {
        let offset;
        if (lastPathname === pathname) {
          offset = emailOffset;
          dispatch(SetLastEmailOffset(offset));
        } else {
          offset = 0;
          dispatch(SetLastEmailOffset(offset));
        }
        const promise = fetchEmails(pathname, offset, EMAIL_LIMIT);
        const promise2 = fetch(Paths.api.overview);
        const emailType = pathnameToEmailType(pathname);
        const promise3 = fetch(Paths.api.emailCount(emailType));
        const [response, response2, response3] = await Promise.all([
          promise,
          promise2,
          promise3
        ]);
        const json = await response.json();
        const json2 = await response2.json();
        const json3 = await response3.json();
        const totalEmails = json3.count;
        dispatch(SetTotalNumberOfEmails(totalEmails));
        const overview = EmailOverview(json2);
        dispatch(SetEmailOverview(overview));
        const sort = json.sort(timestampSort);
        const emails = sort.map(InboxEmail);
        return dispatch(SetEmails(emails));
      } catch (error) {
        const title = "Error";
        const text = error.message;
        return dispatch(ShowAlert(title, text));
      }
    }
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Inbox);
