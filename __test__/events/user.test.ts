import SteamReactor from '../../lib/reactor/SteamReactor';
import { SteamEvents } from '../../lib/reactor/SteamEvents';
import SteamUser from 'steam-user';

let steamReactor: SteamReactor;
let steamUserMock;
let tradeOfferManagerMock;

jest.useFakeTimers(); 
jest.setTimeout(10000);

beforeAll(() => {
    steamUserMock = jest.createMockFromModule('steam-user');
    tradeOfferManagerMock = jest.createMockFromModule("steam-tradeoffer-manager");
});

beforeEach(() => { 
    steamReactor = new SteamReactor({});
});

describe("error", () => {
    it("Should re-emit error", () => {
        const error = jest.fn();

        steamReactor.on(SteamEvents.OnError, ({ error : _error }) => {
            expect(_error).toBe(error);
        });

        steamReactor.user.emit("error", error);
    });
});

describe("loggedOn", () => {

    it("Should emit OnLogin", () => {
        steamReactor.on(SteamEvents.OnLogin, () => {
            expect(true).toBe(true);
        });

        steamReactor.user.emit("loggedOn");
    });
});

describe("webSession", () => {
    it("Should emit OnWebSessionJoin", () => {
        const SESSION_ID = "SESSION_ID";
        const COOKIES = [];

        steamReactor.on(SteamEvents.OnWebSessionJoin, ({ sessionid, cookies }) => {
            expect(sessionid).toBe(SESSION_ID);
            expect(cookies).toBe(COOKIES);
        });

        steamReactor.user.emit("webSession", SESSION_ID, COOKIES);
    });
});

describe("disconnected", () => {
    it("Should emit OnLogout", () => {
        const ERESULT = 42;
        const MSG = "msg";

        steamReactor.on(SteamEvents.OnLogout, ({ eresult, msg }) => {
            expect(eresult).toBe(ERESULT);
            expect(msg).toBe(MSG);
        });

        steamReactor.user.emit("disconnected", ERESULT, MSG);
    });

});

describe("friendMessage", () => {
    it("Should emit OnChatMessage", () => {
        const SID = {
            getSteamID64: () => "STEAM_ID_64"
        };
        const MESSAGE = "message";

        steamReactor.on(SteamEvents.OnChatMessage, ({ steamid, message }) => {
            expect(steamid).toBe(SID.getSteamID64());
            expect(message).toBe(MESSAGE);
        });

        steamReactor.user.emit("friendMessage", SID, MESSAGE);
    });
});

describe("friendRelationship", () => {
    it("Should emit OnFriendRequest for an incoming friend request", () => {
        const SID = {
            getSteamID64: () => "STEAM_ID_64"
        };

        const RELATIONSHIP = SteamUser.EFriendRelationship.RequestRecipient;

        steamReactor.on(SteamEvents.OnFriendRequest, ({ steamid }) => {
            expect(steamid).toBe(SID.getSteamID64());
        });

        steamReactor.user.emit("friendRelationship", SID, RELATIONSHIP);
    });

    it("Should not emit OnFriendRequest for an outgoing friend request", () => {
        const SID = {
            getSteamID64: () => "STEAM_ID_64"
        };

        const RELATIONSHIP = "";

        steamReactor.on(SteamEvents.OnFriendRequest, ({ steamid }) => {
            expect(true).toBe(false);
        });

        steamReactor.user.emit("friendRelationship", SID, RELATIONSHIP);
    });
});

describe("tradeRequest", () => {
    it("All trade requests will be rejected by providing false to callback", () => {
        const SID = {
            getSteamID64: () => "STEAM_ID_64"
        };

        const RESPOND = jest.fn();

        steamReactor.user.emit("tradeRequest", SID, RESPOND);
        expect(RESPOND).toBeCalledTimes(1);
        expect(RESPOND).toBeCalledWith(false);
    });
});