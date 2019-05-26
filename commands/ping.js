const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
    name: 'ping',
    description: 'Sends you the bot\'s ping and API latency',
    aliases: ['latency'],
    cooldown: 5,
    async execute(bot, message) {
        const loading = await message.channel.send(`Pinging...`);
        let pingEmbed = new Discord.RichEmbed()
            .setThumbnail(config.photo)
            .setColor(color.blue)
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .setTimestamp()
            .addField("Pong :ping_pong:", `Latency \`${loading.createdTimestamp - message.createdTimestamp}ms\`\nAPI Latency \`${Math.round(bot.ping)}ms\``);
        loading.edit(pingEmbed)
    },
};