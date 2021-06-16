export class Logger {
    static output(messageToLog: string) {
        console.log(messageToLog);
    }

    static warning(warningToLog: string) {
        console.log("📣 \x1b[33m%s\x1b[0m", warningToLog);
    }

    static error(errorToLog: string) {
        console.log("🚨 \x1b[31m%s\x1b[0m", errorToLog);
    }
}

export const LogMessage = {
    LoggedIn: (steamid: string) => `🔌 Bot ${steamid} logged in`,
    LoggedOut: (steamid: string) => `🔴 Bot ${steamid} logged out or disconnected`,
    WebSessionJoin: (cookies: string[]) => `🍪 Cookies obtained from joining web session: ${cookies}`,
    AwaitingSteamGuard: (steamid: string) => `🛡️ Bot ${steamid} awaiting new Steam Guard code`,
    ReceivedMessageFrom: (sender: string, message: string) => `💬 Chat message from ${sender}: ${message}`,
    SentOfferTo: (receiver: string, offerid: string) => `📤 Sent offer ${offerid} to user ${receiver}`,
    ReceivedOfferFrom: (sender: string, offerid: string) => `📥 Received offer ${offerid} from user ${sender}`,
    TradeCompleted: (offerid: string) => `✅ Trade ${offerid} completed`,
    TradeFailed: (offerid: string) => `❌ Trade ${offerid} failed`,
    ReceivedFriendRequestFrom: (sid: string) => `👋 Friend request received from ${sid}`
}