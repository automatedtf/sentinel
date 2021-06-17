# Sentinel
`Work in Progress`

### **Table of Contents**
- **Introduction**
- **Events**
- **Configuration**
- **Use Cases**

## Introduction

Sentinel is a standardised Steam API event sourcer for events and changes on a Steam user account. Updates are polled on a regular basis via Dr. McKay's `node-steam-user` and `node-steam-tradeoffermanager` and are channeled upstream to a service webhook endpoint as events for applications to process and act upon. This abstraction simplifies worrying about the code to get a 'Steam bot' running, decoupling it away from the logic of other applications within a Steam-related automated system using Steam accounts.

## Events
All events can be defined in `lib/reactor/ESteamEvents`.

### `OnError`
Emitted when an error has occurred.
### `OnLogin`
Emitted when the bot instance has logged into Steam's web client

### `OnWebSessionJoin`
Emitted when the bot has connected to a Steam web session

### `OnLogout`
Emitted when the bot instance has logged out of Steam's web client

### `OnNewTrade`
Emitted when the bot instance receives a new trade offer

### `OnTradeSent`
Emitted when a trade offer from the bot has been sent out

### `OnSentTradeCompleted`
Emitted when a trade offer sent out from the bot has been accepted and confirmed.

### `OnIncomingTradeCompleted`
Emitted when an incoming trade offer to the bot has been accepted and confirmed.

### `OnTradeFailed`
Emitted when any trade offer (incoming or sent) has not been accepted and can't be reacted upon further.

### `OnChatMessage`
Emitted when a chat message was received from another user.

### `OnFriendRequest`
Emitted when a user has chosen to send a friend request to the bot.


## Configuration

Building of the Sentinel Docker image can be done by simply calling `make sentinel-container`, assuming Docker is installed on the runner build system.

To run `make sentinel-instance` successfully to be used within a system, the `ENV_FILE` flag must be set to the path of a `.env` file that states the following as a minimum:

    ACCOUNT_NAME=???
    ACCOUNT_PASSWORD=???
    SHARED_SECRET=???
    IDENTITY_SECRET=???
    STEAMID=???
    UPSTREAM=??? # e.g http://localhost:80/

The following are optional:

    PLAYING_GAME_NAME=???
    LOGON_ID=??? # e.g 336162


## Use Cases

The intricate setup and maintenance for a bot is handled by this application, meaning that one can have a bot instance that starts publishing all new events immediately from startup. As such, there is a layer of abstraction provided for which the handlers for these events can be moved elsewhere e.g a serverless Lambda function or centralised API. This component application is to also work out of the box for a K8s cluster setup with a centralised event / message broker service.