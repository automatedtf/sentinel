require("dotenv").config();
import SteamReactor from './lib/reactor/SteamReactor';
import SteamTotp from 'steam-totp';
import { SteamEvents } from './lib/reactor/SteamEvents';
import axios from 'axios';
import { serialiseData } from './lib/reactor/util';

// Set up bot
let bot = new SteamReactor({
    accountName: process.env.ACCOUNT_NAME,
    password: process.env.ACCOUNT_PASSWORD,
    twoFactorCode: SteamTotp.getAuthCode(process.env.SHARED_SECRET),
    logonID: parseInt(process.env.LOGON_ID) || Math.floor(Math.random() * (2 ** 16))
});

// Send all events upstream if an upstream is set
if (process.env.UPSTREAM != null) {
    Object.values(SteamEvents).forEach((event) => {
        bot.on(event, async (data) => {
            await axios.post(process.env.UPSTREAM, { steamid: process.env.STEAMID, event, data: serialiseData(data) });
        });
    });
}