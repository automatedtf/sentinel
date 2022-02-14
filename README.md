# Sentinel • ![https://github.com/automatedtf/sentinel/actions/workflows/testing.yml/badge.svg](https://github.com/automatedtf/sentinel/actions/workflows/testing.yml/badge.svg)
### 📖 Table of Contents
- [👋 Introduction](#-introduction)
- [🔌 Getting Started](#-getting-started)
- [✨ Events](#-events)
- [💎 What can it be used for?](#-what-can-it-be-used-for)
    - [Distributed Systems](#distributed-systems)

## 👋 Introduction

Sentinel is a standardised Steam API event sourcer for events and changes on a Steam user account through using [`@automatedtf/reactor`](https://github.com/automatedtf/reactor). It is designed to propogate any events emitted from setting up a `SteamReactor` instance to an external web endpoint to allow web services to utilise these events in event-driven architectures.

## 🔌 Getting Started

Building of the Sentinel Docker image can be done by simply calling `make image`, assuming Docker is installed on the runner build system.

To run `make container` successfully to be used within a system, the `ENV_FILE` flag must be set to the path of a `.env` file that states the following as a minimum:

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
All events are derived from `@automatedtf/reactor` and can be found [here](https://github.com/automatedtf/reactor#-events).

## 💎 What can it be used for?

The intricate setup and maintenance for a bot is handled by this application, meaning that one can have a bot instance that starts publishing new events immediately from startup. This can be utilised in a number of ways.

#### Distributed Systems
The feature of pushing events to an upstream through `process.env.UPSTREAM` means that events can be propogated towards an inter-application event handler living somewhere else - think Kubernetes. This provides scalability, especially when event processing is much more memory-consuming in contrast to event sourcing.

##### Applications
- Bot array for a Steam items trading website
- Steam bot event monitoring and logging to record statistics on incoming trades, chat messages etc.
- Pub/Sub MQ to run a Discord notification, notify bot owner, perform the trade processing all as separate microservice applications