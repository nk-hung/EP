const { Client, GatewayIntentBits } = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

// client.on('ready', () => {
//     console.log(`Logged is as ${client.user.tag}`)
// })


// client.login(process.env.DISCORD_TOKEN|| 'MTE1OTM1NDExMDkxMTQ1NTMwMw.GJ0DXT.zeuoA5yKO_WfNrfp91E5YBwRIqerPIOp1eovu8')

// client.on('messageCreate', msg => {
//     if (msg.author.bot) return;
//     if (msg.content === 'hello')  {
//         msg.reply(`Bot lam quan que!! `)
//     }
// })