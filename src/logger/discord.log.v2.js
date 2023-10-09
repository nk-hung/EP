'use strict'

const { Client, GatewayIntentBits } = require("discord.js")

const { TOKEN_DISCORD } = process.env
class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        })
        // add channelId
        this.channelID = '1159411006439686235'

        this.client.on('ready', () => {
            console.log(`Logged ::: ${this.client.user.tag}`)
        })

        this.client.login(TOKEN_DISCORD || 'MTE1OTM1NDExMDkxMTQ1NTMwMw.GJ0DXT.zeuoA5yKO_WfNrfp91E5YBwRIqerPIOp1eovu8');

    }

    sendToFormatCode = (logData) => {
        const {code, message = 'This is bonus info!!', title = 'Code Example'} = logData;
        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 19),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) +'\n```'
                }
            ]
        }
        this.sendToMessage(codeMessage)
    }

    sendToMessage( message = 'message') {
        const channel = this.client.channels.cache.get(this.channelID);
        console.log({channel })
        if (!channel){
            console.error(`Couldn't find the channel ...`, this.channelID)
            return;
        }
        channel.send(message).catch((e) => console.error(e))
    }
}

// const loggerService = new LoggerService();

module.exports = new LoggerService()