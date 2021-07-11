import { TradeOffer } from "@automatedtf/slate";

export enum SteamEvents {
    OnError = "OnError",
    OnLogin = "OnLogin",
    OnWebSessionJoin = "OnWebSessionJoin",
    OnLogout = "OnLogout",
    OnNewTrade = "OnNewTrade",
    OnTradeSent = "OnTradeSent",
    OnSentTradeCompleted = "OnSentTradeCompleted",
    OnIncomingTradeCompleted = "OnIncomingTradeCompleted",
    OnTradeFailed = "OnTradeFailed",
    OnChatMessage = "OnChatMessage",
    OnFriendRequest = "OnFriendRequest"
}

export interface SteamEventDetails {
    [SteamEvents.OnError]: (data: OnErrorDetails) => void;
    [SteamEvents.OnLogin]: (data: OnLoginDetails) => void;
    [SteamEvents.OnWebSessionJoin]: (data: OnWebSessionJoinDetails) => void;
    [SteamEvents.OnLogout]: (data: OnLogoutDetails) => void;
    [SteamEvents.OnNewTrade]: (data: OnNewTradeDetails) => void;
    [SteamEvents.OnTradeSent]: (data: OnTradeSentDetails) => void;
    [SteamEvents.OnSentTradeCompleted]: (data: OnSentTradeCompletedDetails) => void;
    [SteamEvents.OnIncomingTradeCompleted]: (data: OnIncomingTradeCompletedDetails) => void;
    [SteamEvents.OnTradeFailed]: (data: OnTradeFailedDetails) => void;
    [SteamEvents.OnChatMessage]: (data: OnChatMessageDetails) => void;
    [SteamEvents.OnFriendRequest]: (data: OnFriendRequestDetails) => void;
}

interface OnErrorDetails extends Error {};
interface OnLoginDetails {};

interface OnWebSessionJoinDetails {
    sessionid: string;
    cookies: string[];
}

interface OnLogoutDetails {
    eresult: number;
    msg?: string;
}

interface OnNewTradeDetails extends TradeOffer {};
interface OnTradeSentDetails extends TradeOffer {};
interface OnSentTradeCompletedDetails extends TradeOffer {};
interface OnIncomingTradeCompletedDetails extends TradeOffer {};
interface OnTradeFailedDetails extends TradeOffer {};

interface OnChatMessageDetails {
    steamid: string;
    message: string;
}

interface OnFriendRequestDetails {
    steamid: string;
}