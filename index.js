const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const prefix = config.prefix

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

bot.on('ready', () => {
  console.log(`Bot is on. \nCurrently running on ${bot.guilds.size} server with total of ${bot.users.size} users. `);
  bot.user.setActivity(`with Sax's toys. | s!help`, { type: "PLAYING" });
})

bot.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

  const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.dev && !config.owner.includes(message.author.id)) {
	  	return message.channel.send(":x: | You are not accesed to use this command!")
  }
  if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply(':x: | This command cannot be executed in direct messages.');
	}

  if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (!timestamps.has(message.author.id)) {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	else {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime && !config.owners.includes(message.author.id)) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

  try {
		command.execute(bot, message, args);
	}
	catch (err) {
        console.error(`Executing command error: ${err}`);
        message.channel.send("An error occured: " + err")
  }

})

bot.login(process.env.TOKEN)
