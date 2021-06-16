require("dotenv").config();
import { SteamEvents } from "./ESteamEvents";
import SteamUser from "steam-user";
import SteamTradeManager from "steam-tradeoffer-manager";
import { EventEmitter } from "stream";
import SteamTotp from 'steam-totp';
import { Logger, LogMessage } from '../logger/Logger';

export default class SteamReactor extends EventEmitter {
    user: any;
    tradeManager: any;

    userOnline: boolean; // Used to prevent double login attempts

    constructor(userDetails) {
        super();

        this.user = new SteamUser();
        this.userOnline = false;

        this._hookOntoSteamUserListeners();
        this.user.logOn(userDetails);

        this.tradeManager = new SteamTradeManager({ steam: this.user });
    }

    _hookOntoSteamUserListeners() {
        let { user } = this;

        user.on("error", (err: Error) => {
            this.emit(SteamEvents.OnError, err);
            Logger.error(`Received node-steam-user error ${err.message}`);
        });

        user.on("steamGuard", (domain, callback, lastCodeWrong) => {
            this.userOnline = !lastCodeWrong;
            Logger.output(LogMessage.AwaitingSteamGuard(process.env.STEAMID));

            // Last code was wrong so wait 30s for next code to generated
            setTimeout(() => {
                if (!this.userOnline) callback(SteamTotp.getAuthCode(process.env.SHARED_SECRET));
            }, 30 * 1000);
        });

        user.on("loggedOn", (...data) => {
            this.userOnline = true;
            this.emit(SteamEvents.OnLogin, ...data);
            this.user.setPersona(SteamUser.EPersonaState.Online);
            this.user.gamesPlayed([process.env.PLAYING_GAME_NAME || "🔰 Running Sentinel", 440]);
            Logger.output(LogMessage.LoggedIn(process.env.STEAMID));
        });
        
        user.on("webSession", (sessionid, cookies) => {
            this.emit(SteamEvents.OnWebSessionJoin, { sessionid, cookies });
            Logger.output(LogMessage.WebSessionJoin(cookies));
            this.tradeManager.setCookies(cookies);
            this._hookOntoSteamTradeListeners();
        });

        user.on("disconnected", (...data) => {
            this.emit(SteamEvents.OnLogout, data);
            Logger.warning(LogMessage.LoggedOut(this.user.steamID));
        });
    
        user.chat.on("friendMessage", ({ steamid_friend, message }) => {
            this.emit(SteamEvents.OnChatMessage, { steamid: steamid_friend, message });
            Logger.output(LogMessage.ReceivedMessageFrom(steamid_friend, message));
        });
    
        user.on("friendRelationship", (sid, relationship) => {
            if (relationship == SteamUser.EFriendRelationship.RequestRecipient) {
                this.emit(SteamEvents.OnFriendRequest, sid);
                Logger.output(LogMessage.ReceivedFriendRequestFrom(sid));
            } else {
                Logger.warning("Admin has added a friend themselves");
            }
        });

        // Reject all live trade requests
        user.on("tradeRequest", (sid, respond) => respond(false));
    }

    _hookOntoSteamTradeListeners() {
        let { tradeManager } = this;
        let { Active, Accepted, Declined, Expired, Canceled, Countered, InvalidItems, CanceledBySecondFactor } = SteamTradeManager.ETradeOfferState;

        tradeManager.on("newOffer", (offer) => {
            Logger.output(LogMessage.ReceivedOfferFrom(offer.partner, offer.id));
            this.emit(SteamEvents.OnNewTrade, offer);
        });

        tradeManager.on("sentOfferChanged", (offer, oldState) => {
            switch (offer.state) {
                case Active:
                    Logger.output(LogMessage.SentOfferTo(offer.partner, offer.id));
                    this.emit(SteamEvents.OnTradeSent, offer);
                    break;
                case Accepted:
                    Logger.output(LogMessage.TradeCompleted(offer.id));
                    this.emit(SteamEvents.OnSentTradeCompleted, offer);
                    break;
                case InvalidItems:
                case Declined:
                case Expired:
                case CanceledBySecondFactor:
                    Logger.warning(LogMessage.TradeFailed(offer.id));
                    this.emit(SteamEvents.OnTradeFailed, offer);
                    break;
                case Countered:
                    Logger.warning(LogMessage.ReceivedOfferFrom(offer.partner, offer.id));
                    this.emit(SteamEvents.OnNewTrade, offer);
                    break;
            }
        });

        tradeManager.on("receivedOfferChanged", (offer, oldState) => {
            switch (offer.state) {
                case Active:
                    Logger.output(LogMessage.ReceivedOfferFrom(offer.partner, offer.id));
                    this.emit(SteamEvents.OnNewTrade, offer);
                    break;
                case Accepted:
                    Logger.output(LogMessage.TradeCompleted(offer.id));
                    this.emit(SteamEvents.OnIncomingTradeCompleted, offer);
                    break;
                case Declined:
                case Expired:
                case Canceled:
                case InvalidItems:
                    Logger.warning(LogMessage.TradeFailed(offer.id));
                    this.emit(SteamEvents.OnTradeFailed, offer);
                    break;
            }
        });
    }
}