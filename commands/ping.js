const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
    name: 'ping',
    category: "General",
    description: 'Bot\'s latency and ping.',
    aliases: ['latency'],
    cooldown: 5,
    async execute(bot, message) {
        const loading = await message.channel.send(`Pinging...`);
        let pingEmbed = new Discord.RichEmbed()
            .setThumbnail(bot.user.avatarURL)
            .setColor(color.blue)
            .setAuthor("Requested by " + message.author.name, message.author.avatarURL)
            .setTimestamp()
            .addField("Pong :ping_pong:", `Latency \`${loading.createdTimestamp - message.createdTimestamp}ms\`\nAPI Latency \`${Math.round(bot.ping)}ms\``);
        loading.edit(pingEmbed)
    },
};
