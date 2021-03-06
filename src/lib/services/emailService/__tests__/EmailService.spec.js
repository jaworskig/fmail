const EmailService = require("../EmailService");

describe("EmailService", () => {
  it("has a module", () => {
    expect(EmailService).toBeDefined();
    const expected = "function";
    const actual = typeof EmailService;
    expect(expected).toEqual(actual);
  });

  describe("createDraftEmail", () => {
    it("creates a draft email", async () => {
      const mockSave = jest.fn();
      const mockSearchService = {
        saveEmail: jest.fn().mockReturnValue(Promise.resolve())
      };
      const userId = "foo";
      const from = "foo@bar.se";
      const user = {
        id: userId,
        email: from
      };
      const mockUserService = {
        getUser: jest.fn().mockReturnValue(Promise.resolve(user))
      };
      const MockEmailModel = jest.fn(() => {
        return {
          save: mockSave
        };
      });
      const emailService = new EmailService(
        MockEmailModel,
        mockSearchService,
        mockUserService
      );
      const recipients = ["foo@bar.se"];
      const subject = "foo";
      const message = "bar";
      const type = "draft";
      await emailService.createDraftEmail(userId, recipients, subject, message);
      expect(MockEmailModel).toBeCalledWith({
        userId,
        from,
        recipients,
        subject,
        message,
        type
      });
      expect(mockSave).toBeCalled();
      expect(mockSearchService.saveEmail).toBeCalled();
    });

    it("creates a draft email with default subject", async () => {
      const mockSave = jest.fn();
      const mockSearchService = {
        saveEmail: jest.fn().mockReturnValue(Promise.resolve())
      };
      const userId = "foo";
      const from = " foo@bar.se";
      const user = {
        id: userId,
        email: from
      };
      const mockUserService = {
        getUser: jest.fn().mockReturnValue(Promise.resolve(user))
      };
      const MockEmailModel = jest.fn(() => {
        return {
          save: mockSave
        };
      });
      const emailService = new EmailService(
        MockEmailModel,
        mockSearchService,
        mockUserService
      );
      const recipients = ["foo@bar.se"];
      const subject = "";
      const message = "bar";
      const type = "draft";
      const defaultSubject = "<no subject>";
      const viewedAt = new Date().toISOString();
      await emailService.createDraftEmail(
        userId,
        recipients,
        subject,
        message,
        viewedAt
      );
      expect(MockEmailModel).toBeCalledWith({
        recipients,
        from,
        userId,
        subject: defaultSubject,
        message,
        viewedAt,
        type
      });
      expect(mockSave).toBeCalled();
      expect(mockSearchService.saveEmail).toBeCalled();
    });
  });

  describe("createEmail", () => {
    it("creates an email", async () => {
      const mockSave = jest.fn();
      const mockSearchService = {
        saveEmail: jest.fn().mockReturnValue(Promise.resolve())
      };
      const userId = "foo";
      const from = "foo@bar.se";
      const user = {
        id: userId,
        email: from
      };
      const mockUserService = {
        getUser: jest.fn().mockReturnValue(Promise.resolve(user))
      };
      const MockEmailModel = jest.fn(() => {
        return {
          save: mockSave
        };
      });
      const emailService = new EmailService(
        MockEmailModel,
        mockSearchService,
        mockUserService
      );
      const recipients = ["foo@bar.se"];
      const subject = "foo";
      const message = "bar";
      const type = "outgoing";
      await emailService.createEmail(userId, recipients, subject, message);
      expect(MockEmailModel).toBeCalledWith({
        userId,
        from,
        recipients,
        subject,
        message,
        type
      });
      expect(mockSave).toBeCalled();
      expect(mockSearchService.saveEmail).toBeCalled();
    });
  });

  describe("getSentEmails", () => {
    it("gets sent emails", () => {
      const mockFind = jest.fn();
      const MockEmailModel = {
        find: mockFind
      };
      const userId = "foo";
      const query = {
        userId,
        $or: [{ type: "outgoing" }, { type: "sent" }]
      };
      const skip = 0;
      const limit = 0;
      const sort = {
        timestamp: -1
      };
      const options = { skip, limit, sort };
      const emailService = new EmailService(MockEmailModel);
      emailService.getSentEmails(userId, skip, limit);
      expect(mockFind).toBeCalledWith(query, null, options);
    });
  });

  describe("search", () => {
    it("performs a search", async () => {
      const idArray = [];
      const userId = "foo";
      const mockSearchService = {
        findEmail: jest.fn().mockReturnValue(Promise.resolve(idArray))
      };
      const MockEmailModel = {
        find: jest.fn().mockReturnValueOnce(Promise.resolve())
      };
      const q = "foo";
      const offset = 0;
      const limit = 0;
      const emailService = new EmailService(MockEmailModel, mockSearchService);
      const query = {
        userId,
        _id: { $in: idArray }
      };
      await emailService.search(userId, q, offset, limit);
      expect(MockEmailModel.find).toBeCalledWith(query);
      expect(mockSearchService.findEmail).toBeCalledWith(
        userId,
        q,
        offset,
        limit
      );
    });
  });

  describe("setEmailAsImportant", () => {
    it("sets email to important", async () => {
      const mockEmail = {
        save: jest.fn().mockReturnValue(Promise.resolve())
      };
      const MockEmailModel = {
        findOne: jest.fn().mockReturnValueOnce(Promise.resolve(mockEmail))
      };
      const emailId = "id";
      const userId = "foo";
      const isImportant = true;
      const emailService = new EmailService(MockEmailModel);
      await emailService.setEmailAsImportant(userId, emailId, isImportant);
      expect(MockEmailModel.findOne).toBeCalledWith({ _id: emailId, userId });
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
        findOne: jest.fn().mockReturnValueOnce(Promise.resolve(mockEmail))
      };
      const emailId = "id";
      const userId = "foo";
      const viewedAt = "2019-01-01";
      const emailService = new EmailService(MockEmailModel);
      await emailService.setEmailToViewed(userId, emailId, viewedAt);
      expect(MockEmailModel.findOne).toBeCalledWith({ _id: emailId, userId });
      expect(mockEmail.save).toBeCalledWith();
      expect(mockEmail.viewedAt).toEqual(viewedAt);
    });
  });

  describe("getEmail", () => {
    it("gets an email", () => {
      const mockFind = jest.fn();
      const emailId = "foo";
      const userId = "foo";
      const MockEmailModel = {
        findOne: mockFind
      };
      const emailService = new EmailService(MockEmailModel);
      emailService.getEmail(userId, emailId);
      expect(mockFind).toBeCalledWith({ _id: emailId, userId });
    });
  });

  describe("removeEmail", () => {
    it("removes an email", async () => {
      const mockFind = jest.fn();
      const emailId = "foo";
      const userId = "foo";
      const mockRemove = jest.fn();
      const mockSearchService = {
        deleteEmail: jest.fn().mockReturnValue(Promise.resolve())
      };
      const mockEmail = {
        remove: mockRemove
      };
      const MockEmailModel = {
        findOne: mockFind.mockReturnValue(Promise.resolve(mockEmail))
      };
      const emailService = new EmailService(MockEmailModel, mockSearchService);
      await emailService.removeEmail(userId, emailId);
      expect(mockFind).toBeCalledWith({ _id: emailId, userId });
      expect(mockRemove).toBeCalled();
      expect(mockSearchService.deleteEmail).toBeCalled();
    });
  });

  describe("getImportantEmails", () => {
    it("gets important emails", () => {
      const mockFind = jest.fn();
      const MockEmailModel = {
        find: mockFind
      };
      const userId = "foo";
      const query = { userId, isImportant: true };
      const skip = 0;
      const limit = 0;
      const sort = {
        timestamp: -1
      };
      const options = { skip, limit, sort };
      const emailService = new EmailService(MockEmailModel);
      emailService.getImportantEmails(userId, skip, limit);
      expect(mockFind).toBeCalledWith(query, null, options);
    });
  });

  describe("getInboxEmails", () => {
    it("gets inbox emails", () => {
      const mockFind = jest.fn();
      const MockEmailModel = {
        find: mockFind
      };
      const userId = "foo";
      const query = { userId, type: "received", isSpam: false };
      const skip = 0;
      const limit = 0;
      const sort = {
        timestamp: -1
      };
      const options = { skip, limit, sort };
      const emailService = new EmailService(MockEmailModel);
      emailService.getInboxEmails(userId, skip, limit);
      expect(mockFind).toBeCalledWith(query, null, options);
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
      const userId = "foo";
      const query = { userId, isSpam: true };
      const skip = 0;
      const limit = 0;
      const sort = {
        timestamp: -1
      };
      const options = { skip, limit, sort };
      const emailService = new EmailService(MockEmailModel);
      emailService.getSpamEmails(userId, skip, limit);
      expect(mockFind).toBeCalledWith(query, null, options);
    });
  });

  describe("getDraftEmails", () => {
    it("gets draft emails", () => {
      const mockFind = jest.fn();
      const MockEmailModel = {
        find: mockFind
      };
      const userId = "foo";
      const query = { userId, type: "draft" };
      const skip = 0;
      const limit = 0;
      const sort = {
        timestamp: -1
      };
      const options = { skip, limit, sort };
      const emailService = new EmailService(MockEmailModel);
      emailService.getDraftEmails(userId, skip, limit);
      expect(mockFind).toBeCalledWith(query, null, options);
    });
  });

  describe("updateDraftEmail", () => {
    it("updates a draft email", async () => {
      const mockFind = jest.fn();
      const mockEmail = {
        save: jest.fn()
      };
      const MockEmailModel = {
        findOne: mockFind.mockReturnValue(Promise.resolve(mockEmail))
      };
      const userId = "foo";
      const emailId = "foo";
      const recipients = ["foo"];
      const subject = "foo";
      const message = "foo";
      const emailService = new EmailService(MockEmailModel);
      await emailService.updateDraftEmail(
        userId,
        emailId,
        recipients,
        subject,
        message
      );
      expect(mockFind).toBeCalledWith({ _id: emailId, userId });
      expect(mockEmail.recipients).toEqual(recipients);
      expect(mockEmail.subject).toEqual(subject);
      expect(mockEmail.message).toEqual(message);
    });
  });
});
