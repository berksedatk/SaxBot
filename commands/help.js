const config = require('../config.json');
const fs = require('fs');
const Discord = require('discord.js');
const prefix = config.prefix;
const color = require('../data/colors.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

module.exports = {
	name: 'help',
	description: "Shows up the commands of the Gladiator.",
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(bot, message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Here\'s a list of all my commands: \n');
			commands.map(command => {
				if (!command.dev) {
					data.push(command.name + " - " + command.description)
				}
			}).join(' \n')
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.react("📩")
					})
					.catch(error => {
					message.reply("It seems like I can't DM you. Please enable your DMs!");
					});
		}
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply("that\'s not a valid command, use &help to get list of the commands.");
			}

		data.push(helpEmbed = new Discord.RichEmbed());
		data.push(helpEmbed.setTitle(command.name));
		data.push(helpEmbed.setColor(color.blue));
		data.push(helpEmbed.setTimestamp());
		data.push(helpEmbed.setAuthor(bot.user.username, bot.user.avatarURL));

		if (command.aliases) data.push(helpEmbed.addField("**Aliases:**", command.aliases.join(', ')));
		if (command.description) data.push(helpEmbed.addField("**Description:**", command.description));
		if (command.usage) data.push(helpEmbed.addField("**Usage:**", prefix+command.name+" "+command.usage));
		if (command.cooldown) data.push(helpEmbed.addField("**Cooldown:**", command.cooldown+"second(s)"));

		data.push(message.channel.send(helpEmbed))

		message.channel.send(data.helpEmbed, { split: true });
	}
};
