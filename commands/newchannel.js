const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
  name: 'newchannel',
  category: "Utility",
  description: 'Creates a new channel. The setup will start when you execute the command.',
  cooldown: 10,
  guildOnly: 'true',
  reqPermissions: ['EDIT_CHANNELS'],
  async execute(bot, message, args) {
    await msg = message.channel.send("Are you ready to start the setup?, `y,n`");
    message.channel.awaitMessages(m => m.author.id = message.author.id, { max: 1, time: 15000, errors: ['time'] })
      .then(collected => {
        if (!collected.content === "y") return message.channel.send("Setup cancelled.");
        msg.edit("Great! Now tell what should I name the channel? `Use only numbers and letters. Spaces will be turned into dashes. \nYou can cancel setup by typing `cancel`.");
        message.channel.awaitMessages(m => m.author.id = message.author.id, { max: 1, time: 15000, errors: ['time'] })
          .then(collected => {
            if (collected.content === "cancel") return message.channel.send("Setup cancelled.");
            let colName = collected.content.split(/ +/);
            colName.map(c => {
              if (c === " ") {
                c = "-"
              }
            })
            let cnName = ""
            colName.map(n => {
              cnName += n
            });
            message.channel.awaitMessages(m => m.author.id = message.author.id, { max: 1, time: 15000, errors: ['time'] })
              .then(collected => {
                msg.edit(`So the channel name will be \`${cnName}\`. Which category the channel should be in? \n\`You can skip this, complete the setup or cancel the setup.\``)
                if (collected.content === "cancel") return message.channel.send("Setup cancelled.");
                if (collected.content === "complete") {
                  message.guild.createChannel(cnName)
                  return msg.edit("Channel created!")
                }
                if (!collected.content === "skip") {

                }
              })
          });
      });
  }
}
