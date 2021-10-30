import SteamReactor from '../../reactor/SteamReactor';
import { ISteamUser } from '../../reactor/SteamReactor';
import { SteamEvents } from '../../reactor/SteamEvents';
import SteamTradeManager from 'steam-tradeoffer-manager';

const { Active, Accepted, Declined, Expired, Canceled, Countered, InvalidItems, CanceledBySecondFactor } = SteamTradeManager.ETradeOfferState;

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

describe("newOffer", () => {

    it("Should emit OnNewTrade", () => {
        const MINIMAL_OFFER = {};
    
        steamReactor.on(SteamEvents.OnNewTrade, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });
    
        steamReactor.tradeManager.emit("newOffer", MINIMAL_OFFER);
    });
});

describe("sentOfferChanged", () => {
    it("Should emit OnTradeSent for an newly active offer", () => {
        
        const MINIMAL_OFFER = { state: Active };
        steamReactor.on(SteamEvents.OnTradeSent, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("sentOfferChanged", MINIMAL_OFFER);
    });

    it("Should emit OnSentTradeCompleted for the new acceptance of an outgoing offer", () => {

        const MINIMAL_OFFER = { state: Accepted };
        steamReactor.on(SteamEvents.OnSentTradeCompleted, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("sentOfferChanged", MINIMAL_OFFER);
    });

    it("Should emit OnTradeFailed if offer now contains invalid items", () => {

        const MINIMAL_OFFER = { state: InvalidItems };
        steamReactor.on(SteamEvents.OnTradeFailed, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("sentOfferChanged", MINIMAL_OFFER);
    });

    it("Should emit OnTradeFailed if outgoing offer has declined", () => {

        const MINIMAL_OFFER = { state: Declined };
        steamReactor.on(SteamEvents.OnTradeFailed, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("sentOfferChanged", MINIMAL_OFFER);
    });

    it("Should emit OnTradeFailed if outgoing offer expires", () => {

        const MINIMAL_OFFER = { state: Expired };
        steamReactor.on(SteamEvents.OnTradeFailed, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("sentOfferChanged", MINIMAL_OFFER);
    });


    it("Should emit OnTradeFailed if pending outgoing offer is cancelled during confirmation", () => {

        const MINIMAL_OFFER = { state: CanceledBySecondFactor };
        steamReactor.on(SteamEvents.OnTradeFailed, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("sentOfferChanged", MINIMAL_OFFER);
    });

    it("Should emit OnNewTrade if outgoing offer is countered", () => {

        const MINIMAL_OFFER = { state: Countered };
        steamReactor.on(SteamEvents.OnNewTrade, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("sentOfferChanged", MINIMAL_OFFER);
    });
});

describe("receivedOfferChanged", () => {

    it("Should emit OnNewTrade if incoming offer state is active", () => {

        const MINIMAL_OFFER = { state: Active };
        steamReactor.on(SteamEvents.OnNewTrade, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("receivedOfferChanged", MINIMAL_OFFER);
    });

    it("Should emit OnIncomingTradeCompleted if incoming offer is accepted and confirmed by us", () => {

        const MINIMAL_OFFER = { state: Accepted };
        steamReactor.on(SteamEvents.OnIncomingTradeCompleted, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("receivedOfferChanged", MINIMAL_OFFER);
    });

    it("Should emit OnTradeFailed if incoming offer is declined", () => {

        const MINIMAL_OFFER = { state: Declined };
        steamReactor.on(SteamEvents.OnTradeFailed, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("receivedOfferChanged", MINIMAL_OFFER);
    });

    it("Should emit OnTradeFailed if incoming offer expires", () => {

        const MINIMAL_OFFER = { state: Expired };
        steamReactor.on(SteamEvents.OnTradeFailed, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("receivedOfferChanged", MINIMAL_OFFER);
    });

    it("Should emit OnTradeFailed if incoming offer is cancelled", () => {

        const MINIMAL_OFFER = { state: Canceled };
        steamReactor.on(SteamEvents.OnTradeFailed, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("receivedOfferChanged", MINIMAL_OFFER);
    });

    it("Should emit OnTradeFailed if incoming offer contains invalid items", () => {

        const MINIMAL_OFFER = { state: InvalidItems };
        steamReactor.on(SteamEvents.OnTradeFailed, ({ offer }) => {
            expect(offer).toBe(MINIMAL_OFFER);
        });

        steamReactor.tradeManager.emit("receivedOfferChanged", MINIMAL_OFFER);
    });
});