const config = require('../config.json');
const fs = require('fs');
const Discord = require('discord.js');
const prefix = config.prefix;
const color = require('../data/colors.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

module.exports = {
	name: 'help',
	category: "General",
	description: "Shows up the commands of the Gladiator.",
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(bot, message, args) {
		const general = [];
		const fun = [];
		const moderation = [];
		const utility = [];
		const misc = [];
		const { commands } = message.client;

		if (!args.lenght) {
			commands.map(c => {
				if (c.dev) {
					return;
				} else if (c.category === "General") {
					general.push(`${c.name} - ${c.description} \n`)
				} else if (c.category === "Fun") {
					fun.push(`${c.name} - ${c.description} \n`)
				} else if (c.category === "Moderation") {
					moderation.push(`${c.name} - ${c.description} \n`)
				} else if (c.category === "Utility") {
					utility.push(`${c.name} - ${c.description} \n`)
				} else {
					misc.push(`${c.name} - ${c.description} \n`)
				}
			});

			let helpEmbed = new Discord.RichEmbed()
			.setTitle("Here are the commands:")
			.setTimestamp()
			.setAuthor("Requested by " + message.author.name, message.author.avatarURL)
			.setColor("BLUE")
			if (general.lenght) {
				helpEmbed.addField("General Commands:", general)
			}
			if (fun.lenght) {
				helpEmbed.addField("Fun Commands:", fun)
			}
			if (moderation.lenght) {
				helpEmbed.addField("Moderation Commands:", moderation)
			}
			if (utility.lenght) {
				helpEmbed.addField("Utility Commands:", utility)
			}
			if (misc.lenght) {
				helpEmbed.addField("Misc. Commands:", misc)
			}
			helpEmbed.addField(`You can provide a command to get into details. ${prefix}help <command name>`,)

		  return message.author.send(helpEmbed)
			   .then(() => {
					 if (message.channel.type === "dm") return;
					 message.react("📩")
				 })
				 .catch(error => {
					 message.reply("It seems like I cant DM you. Please enable your DMs!");
				 });
		}


//		if (!args.length) {
//			data.push('Here\'s a list of all my commands: \n');
//			commands.map(command => {
//				if (!command.dev) {
//					data.push(command.name + " - " + command.description)
//				}
//			}).join(' \n')
//			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
//
//			return message.author.send(data, { split: true })
//				.then(() => {
//					if (message.channel.type === 'dm') return;
//					message.react("📩")
//					})
//					.catch(error => {
//					message.reply("It seems like I can't DM you. Please enable your DMs!");
//					});
//		}
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply("That\'s not a valid command, use &help to get list of the commands.");
			}

		data.push(helpEmbed = new Discord.RichEmbed());
		data.push(helpEmbed.setTitle(command.name));
		data.push(helpEmbed.setColor(color.blue));
		data.push(helpEmbed.setTimestamp());
		data.push(helpEmbed.setAuthor(bot.user.username, bot.user.avatarURL));

		if (command.aliases) data.push(helpEmbed.addField("**Aliases:**", command.aliases.join(', ')));
		if (command.category) data.push(helpEmbed.addField("**Category:**", command.category))
		if (command.description) data.push(helpEmbed.addField("**Description:**", command.description));
		if (command.usage) data.push(helpEmbed.addField("**Usage:**", prefix+command.name+" "+command.usage));
		if (command.cooldown) data.push(helpEmbed.addField("**Cooldown:**", command.cooldown+"second(s)"));

		data.push(message.channel.send(helpEmbed))

		message.channel.send(data.helpEmbed, { split: true });
	}
};
