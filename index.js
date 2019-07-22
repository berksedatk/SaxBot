const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const mongoose = require('mongoose');
const Server = require('./models/server.js');

const prefix = config.prefix

mongoose.connect(process.env.DB_TOKEN, {
  useNewUrlParser: true
});

const bot = new Discord.Client({
  disableEveryone: true
});
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

bot.on('ready', () => {
  console.log(`Bot is on. \nCurrently running on ${bot.guilds.size} server with total of ${bot.users.size} users. `);
  bot.user.setActivity(`with Sax's toys. | s!help`, {
    type: "PLAYING"
  });
})

bot.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = bot.commands.get(commandName) ||
    bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.dev && !config.owner.includes(message.author.id)) {
    return message.channel.send(":x: | You are not accesed to use this command!")
  }
  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply(':x: | This command cannot be executed in direct messages.');
  }
  if (command.reqPermissions) {
    command.reqPermissions.map(p => {
      if (!message.guild.members.get(message.author.id).hasPermission(p)) {
        return message.channel.send(":x: | You are not accesed to use this command! Required permission: " + p);
      }
    })
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
  } else {
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
  } catch (err) {
    console.error(`Executing command error: ${err}`);
    message.channel.send("An error occured: " + err)
  }
});

bot.on('message', msg => {

  const xpmsg = msg.content.split("");
  if (xpmsg.size < 12 || xpmsg.size > 200 || msg.author.bot || msg.content.startsWith(prefix)) return;

  const rawxp = Math.floor(Math.random() * 100) + 1;

  let addxp = false;

  Server.findOne({
    guildID: msg.guild.id
  }, (err, dbGuild) => {
    if (err) return msg.channel.send("An error occured on database, please contact devs: " + err);
    if (!dbGuild) {
      msg.channel.send("An error occured on database, please contact devs.")
    } else if (dbGuild) {
      let xpUser;
      let count = 0;
      dbGuild.xpData.map(() => count = +1);
      for (var i = 0; i < count; i++) {
        if (dbGuild.xpData[i].UserID === msg.author.id) {
          xpUser = dbGuild.xpData[i]
          msg.channel.send(xpUser.xp)
        }
      }
      if (xpUser === undefined) {
        msg.channel.send("User Not Found")
        dbGuild.xpData.push({
          UserID: msg.author.id,
          xp: rawxp,
          lastMsg: msg.createdTimestamp
        })
        dbGuild.save().catch(err => {
          msg.channel.send("An error occured: " + err)
        });
      } else {
        msg.channel.send("User Found")
        addxp = true
      }
    }
  });

  if (addxp === true) {
    msg.channel.send("Adding xp")
    Server.update({
      "xpData.UserID": msg.author.id
    }, {
      $inc: {
        "xpData.$.xp": rawxp
      }
    })
    dbGuild.save().catch(err => {
      msg.channel.send("An error occured: " + err)
    });
  } else {
    msg.channel.send("O " +addxp)
  }
});

bot.on('guildCreate', guild => {
  const guildEmbed = new Discord.RichEmbed()
    .setTitle("**New guild added!**")
    .setThumbnail(guild.iconURL)
    .setTimestamp()
    .setColor("GOLD")
    .addField("Guild Name", guild.name + "(" + guild.id + ")")
    .addField("Guild Owner", guild.owner.user.username + "(" + guild.owner.id + ")")
    .addField("Member Count", guild.memberCount);
  bot.channels.get("602134877273456643").send(guildEmbed);
  Server.findOne({
    guildID: guild.id
  }, (err, dbGuild) => {
    if (!dbGuild) {
      guild.owner.send(`Thanks for adding me on **${guild.name}**, you can view my commands by using \`s!help\` command!`);
      const newGuild = new Server({
        _id: mongoose.Types.ObjectId(),
        guildOwnerID: guild.owner.id,
        guildID: guild.id,
        guildSettings: [{
          xp: true
        }],
        xpData: [],
        channelData: [],
        roleRewards: []
      });
      newGuild.save().catch(err => {
        console.log("Error while joining: " + err);
        return guild.owner.send("An error occured while joining server. Please contact with developers: " + err);
      });
    };
    if (err) {
      console.log("Error while joinig: " + err);
      guild.owner.send("An error occured while joining server. Please contact with developers: " + err);
    };
    if (dbGuild) {
      guild.owner.send(`Yay! I knew you would add me back to ${guild.name}. Remember, you can use \`s!help\` to view my commands.`);
    };
  });
});

bot.on('guildDelete', guild => {
  const guildEmbed = new Discord.RichEmbed()
    .setTitle("**Guild removed.**")
    .setThumbnail(guild.iconURL)
    .setTimestamp()
    .setColor("RED")
    .addField("Guild Name", guild.name + "(" + guild.id + ")")
    .addField("Guild Owner", guild.owner.user.username + "(" + guild.owner.id + ")")
  bot.channels.get("602134877273456643").send(guildEmbed)
})

bot.login(process.env.TOKEN)
