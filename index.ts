require("dotenv").config();
import axios from 'axios';
import { serialiseData, SteamEvents, SteamReactor } from '@automatedtf/reactor';

// Set up bot
try {
    const bot = new SteamReactor({
        steamid: process.env.STEAMID,
        accountName: process.env.ACCOUNT_NAME,
        password: process.env.ACCOUNT_PASSWORD,
        sharedSecret: process.env.SHARED_SECRET,
        logonID: process.env.LOGON_ID ? parseInt(process.env.LOGON_ID) : undefined
    });

    // Send all events upstream if an upstream is set
    if (process.env.UPSTREAM != null) {
        Object.values(SteamEvents).forEach((event) => {
            bot.on(event, (data) => {
                axios.post(process.env.UPSTREAM, { steamid: process.env.STEAMID, event, data: serialiseData(data) });
            });
        });
    }
} catch (error) {
    if (process.env.UPSTREAM != null) {
        axios.post(process.env.UPSTREAM, { steamid: process.env.STEAMID, event: "SentinelError", data: error.message });
    }
}