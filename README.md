# Sentinel
### 📖 Table of Contents
- [👋 Introduction](#introduction)
- [🔌 Getting Started](#getting-started)
- [✨ Events](#events)
- [💎 What can it be used for?](#what-can-it-be-used-for)
    - [Single Instance Bots](#single-instance-bots)
    - [Distributed Systems](#distributed-systems)

## 👋 Introduction

Sentinel is a standardised Steam API event sourcer for events and changes on a Steam user account. Updates are polled on a regular basis via Dr. McKay's `node-steam-user` and `node-steam-tradeoffermanager` and are channeled upstream to a service webhook endpoint as events for applications to process and act upon. This abstraction simplifies worrying about the code to get a 'Steam bot' running, decoupling it away from the logic of other applications within a Steam-related automated system using Steam accounts.
## 🔌 Getting Started

Building of the Sentinel Docker image can be done by simply calling `make sentinel-container`, assuming Docker is installed on the runner build system.

To run `make sentinel-instance` successfully to be used within a system, the `ENV_FILE` flag must be set to the path of a `.env` file that states the following as a minimum:

```env
ACCOUNT_NAME=???
ACCOUNT_PASSWORD=???
SHARED_SECRET=???
IDENTITY_SECRET=???
STEAMID=???
UPSTREAM=??? # e.g http://localhost:80/
```

The following can be optionally added:
```
PLAYING_GAME_NAME=???
LOGON_ID=??? # e.g 336162
```

## ✨ Events
All events can be defined in `lib/reactor/ESteamEvents`.

### `OnError`
Emitted when an error has occurred.
- `error: Error` - Error object of the error

### `OnLogin`
Emitted when the bot instance has logged into Steam's web client. No new information is learnt so none returned.

### `OnWebSessionJoin`
Emitted when the bot has connected to a Steam web session.
- `sessionid: string`
- `cookies: string[]`


### `OnLogout`
Emitted when the bot instance has logged out of Steam's web client
- `eresult: number`
- `msg?: string`
### `OnNewTrade`
Emitted when the bot instance receives a new trade offer
- `offer: TradeOffer`

### `OnTradeSent`
Emitted when a trade offer from the bot has been sent out
- `offer: TradeOffer`

### `OnSentTradeCompleted`
Emitted when a trade offer sent out from the bot has been accepted and confirmed.
- `offer: TradeOffer`

### `OnIncomingTradeCompleted`
Emitted when an incoming trade offer to the bot has been accepted and confirmed.
- `offer: TradeOffer`

### `OnTradeFailed`
Emitted when any trade offer (incoming or sent) has not been accepted and can't be reacted upon further.
- `offer: TradeOffer`

### `OnChatMessage`
Emitted when a chat message was received from another user.
- `steamid: string`
- `message: string`

### `OnFriendRequest`
Emitted when a user has chosen to send a friend request to the bot.
- `steamid: string`

## 💎 What can it be used for?

The intricate setup and maintenance for a bot is handled by this application, meaning that one can have a bot instance that starts publishing new events immediately from startup. This can be utilised in a number of ways.

#### Single Instance Bots
By applying on handlers within `index.ts`, one can easily use `sentinel` as a foundation for their own bot with more features.

```typescript
// index.ts

let bot = new SteamReactor({
    accountName: process.env.ACCOUNT_NAME,
    password: process.env.ACCOUNT_PASSWORD,
    twoFactorCode: SteamTotp.getAuthCode(process.env.SHARED_SECRET),
    logonID: parseInt(process.env.LOGON_ID) || Math.floor(Math.random() * (2 ** 16))
});

bot.on(SteamEvents.OnLogin, () => {
    console.log("Bot has logged in!");
});
```

##### Applications
- Donation bot
- Backpack.tf classifieds bot
- Chat message bot

#### Distributed Systems
The feature of pushing events to an upstream through `process.env.UPSTREAM` means that events can be propogated towards an inter-application event handler living somewhere else - think Kubernetes. This provides scalability, especially when event processing is much more memory-consuming in contrast to event sourcing.

##### Applications
- Bot array for a Steam items trading website
- Steam bot event monitoring and logging to record statistics on incoming trades, chat messages etc.
- Pub/Sub MQ to run a Discord notification, notify bot owner, perform the trade processing all as separate microservice applications