const EmailService = require("../EmailService");

describe("EmailService", () => {
  it("has a module", () => {
    expect(EmailService).toBeDefined();
    const expected = "function";
    const actual = typeof EmailService;
    expect(expected).toEqual(actual);
  });

  describe("createDraftEmail", () => {
    it("creates a draft email", () => {
      const mockSave = jest.fn();
      const MockEmailModel = jest.fn(() => {
        return {
          save: mockSave
        };
      });
      const emailService = new EmailService(MockEmailModel);
      const recipients = ["foo@bar.se"];
      const subject = "foo";
      const message = "bar";
      const type = "draft";
      emailService.createDraftEmail(recipients, subject, message);
      expect(MockEmailModel).toBeCalledWith({
        recipients,
        subject,
        message,
        type
      });
      expect(mockSave).toBeCalled();
    });

    it("creates a draft email with default subject", () => {
      const mockSave = jest.fn();
      const MockEmailModel = jest.fn(() => {
        return {
          save: mockSave
        };
      });
      const emailService = new EmailService(MockEmailModel);
      const recipients = ["foo@bar.se"];
      const subject = "";
      const message = "bar";
      const type = "draft";
      const defaultSubject = "<no subject>";
      emailService.createDraftEmail(recipients, subject, message);
      expect(MockEmailModel).toBeCalledWith({
        recipients,
        subject: defaultSubject,
        message,
        type
      });
      expect(mockSave).toBeCalled();
    });
  });

  describe("createEmail", () => {
    it("creates an email", () => {
      const mockSave = jest.fn();
      const MockEmailModel = jest.fn(() => {
        return {
          save: mockSave
        };
      });
      const emailService = new EmailService(MockEmailModel);
      const recipients = ["foo@bar.se"];
      const subject = "foo";
      const message = "bar";
      const type = "outgoing";
      emailService.createEmail(recipients, subject, message);
      expect(MockEmailModel).toBeCalledWith({
        recipients,
        subject,
        message,
        type
      });
      expect(mockSave).toBeCalled();
    });
  });

  describe("getSentEmails", () => {
    it("gets sent emails", () => {
      const mockFind = jest.fn();
      const MockEmailModel = {
        find: mockFind
      };
      const query = {
        $or: [{ type: "outgoing" }, { type: "sent" }]
      };
      const emailService = new EmailService(MockEmailModel);
      emailService.getSentEmails();
      expect(mockFind).toBeCalledWith(query);
    });
  });

  describe("setEmailAsImportant", () => {
    it("sets email to important", async () => {
      const mockEmail = {
        save: jest.fn().mockReturnValue(Promise.resolve())
      };
      const MockEmailModel = {
        findById: jest.fn().mockReturnValueOnce(Promise.resolve(mockEmail))
      };
      const emailId = "id";
      const isImportant = true;
      const emailService = new EmailService(MockEmailModel);
      await emailService.setEmailAsImportant(emailId, isImportant);
      expect(MockEmailModel.findById).toBeCalledWith(emailId);
      expect(mockEmail.save).toBeCalledWith();
      expect(mockEmail.isImportant).toEqual(isImportant);
    });
  });

  describe("setEmailToViewed", () => {
    it("sets email to viewed", async () => {
      const mockEmail = {
        save: jest.fn().mockReturnValue(Promise.resolve())
      };
      const MockEmailModel = {
        findById: jest.fn().mockReturnValueOnce(Promise.resolve(mockEmail))
      };
      const emailId = "id";
      const viewedAt = "2019-01-01";
      const emailService = new EmailService(MockEmailModel);
      await emailService.setEmailToViewed(emailId, viewedAt);
      expect(MockEmailModel.findById).toBeCalledWith(emailId);
      expect(mockEmail.save).toBeCalledWith();
      expect(mockEmail.viewedAt).toEqual(viewedAt);
    });
  });

  describe("getEmail", () => {
    it("gets an email", () => {
      const mockFind = jest.fn();
      const emailId = "foo";
      const MockEmailModel = {
        findById: mockFind
      };
      const emailService = new EmailService(MockEmailModel);
      emailService.getEmail(emailId);
      expect(mockFind).toBeCalledWith(emailId);
    });
  });

  describe("getImportantEmails", () => {
    it("gets important emails", () => {
      const mockFind = jest.fn();
      const MockEmailModel = {
        find: mockFind
      };
      const query = { isImportant: true };
      const emailService = new EmailService(MockEmailModel);
      emailService.getImportantEmails();
      expect(mockFind).toBeCalledWith(query);
    });
  });

  describe("getInboxEmails", () => {
    it("gets inbox emails", () => {
      const mockFind = jest.fn();
      const MockEmailModel = {
        find: mockFind
      };
      const query = { type: "received", isSpam: false };
      const emailService = new EmailService(MockEmailModel);
      emailService.getInboxEmails();
      expect(mockFind).toBeCalledWith(query);
    });
  });

  describe("getEmailOverview", () => {
    it("gets email overview", async () => {
      const mockStats = {
        unreadInboxEmails: 1,
        draftEmails: 1,
        unreadSpamEmails: 1
      };
      const mockCount = jest.fn().mockReturnValue(Promise.resolve(1));
      const MockEmailModel = {
        count: mockCount
      };
      const query1 = { type: "received", isSpam: false };
      const query2 = { type: "draft" };
      const query3 = { type: "received", isSpam: true };
      const emailService = new EmailService(MockEmailModel);
      const result = await emailService.getEmailOverview();
      expect(mockCount).toHaveBeenNthCalledWith(1, query1);
      expect(mockCount).toHaveBeenNthCalledWith(2, query2);
      expect(mockCount).toHaveBeenNthCalledWith(3, query3);
      expect(mockStats).toEqual(result);
    });
  });

  describe("getSpamEmails", () => {
    it("gets spam emails", () => {
      const mockFind = jest.fn();
      const MockEmailModel = {
        find: mockFind
      };
      const query = { isSpam: true };
      const emailService = new EmailService(MockEmailModel);
      emailService.getSpamEmails();
      expect(mockFind).toBeCalledWith(query);
    });
  });

  describe("getDraftEmails", () => {
    it("gets draft emails", () => {
      const mockFind = jest.fn();
      const MockEmailModel = {
        find: mockFind
      };
      const query = { type: "draft" };
      const emailService = new EmailService(MockEmailModel);
      emailService.getDraftEmails();
      expect(mockFind).toBeCalledWith(query);
    });
  });
});
