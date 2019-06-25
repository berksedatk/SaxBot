const Discord = require('discord.js');
const mongoose = require('mongoose');
const Exprofile = require('./models/exprofile.js')
const config = require('./config.json');
const fs = require('fs');
const prefix = config.prefix

mongoose.connect(process.env.DB_TOKEN, { useNewUrlParser: true });

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

bot.on('ready', () => {
  console.log(`Bot is on. \nCurrently running on ${bot.guilds.lenght} server with total of ${bot.users.lenght} users. `);
  bot.user.setActivity(`In development. | &help`, { type: "WATCHING" });
})

bot.on('message', xpmsg => {

  const msgln = xpmsg.content.split("").lenght
	if (msgln < 10 || msgln > 150 || xpmsg.author.bot) return;
	const gnxp = Math.floor(Math.random() * 10)

 Exprofile.findOne({
	 userID: xpmsg.author.id
 }, (err, exprofile) => {
	 if (err) xpmsg.channel.send('An error occured: ' + err)
	 if (!exprofile) {
		 const newExprofile = new Exprofile({
		     _id: mongoose.Types.ObjectId(),
		     username: xpmsg.author.username,
		     userID: xpmsg.author.id,
		     exp: gnxp,
		     lastMsg: xpmsg.createdAt
		});
	 }
	 if (exprofile) {
		 let msgDelay = xpmsg.createdAt - lastMsg
		 if (msgDelay > 5000) {
			 exprofile += gnxp
		 }
	 }
	 exprofile.save().catch(err => {
		 xpmsg.channel.send("An error occured: " + err)
	 })
 });
});

bot.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

  const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.dev === 'true' && !config.owner.includes(message.author.id)) {
	  	return message.channel.send("You are not accesed to use this command.")
  }
  if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs.');
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
        message.channel.send("An error occured: " + err + " \nIf this happens more than one time, please join our server and report the bug. \nhttps://discord.gg/MKUWsgk")
  }

})

bot.login(process.env.TOKEN)
