const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');
const mongoose = require('mongoose');
const Exprofile = require('../models/exprofile.js')

module.exports = {
    name: 'level',
    description: 'See your exp level!',
    aliases: ['exp','lvl'],
    cooldown: 10,
    dev: 'true',
    async execute(bot, message, args) {
    	mongoose.connect(process.env.DB_TOKEN, { useNewUrlParser: true });

      let data = [];

      Exprofile.findOne({
        userID: message.author.id
      }, (err, exprofile) => {
        if (err) return message.channel.send('An error occured: ' + err);
        if (!exprofile) {
          const newExprofile = new Exprofile({
     		     _id: mongoose.Types.ObjectId(),
     		     username: message.author.username,
     		     userID: message.author.id,
     		     exp: 0,
     		     lastMsg: message.createdAt
     		 });
         exprofile.save().catch(err => {
      		 xpmsg.send('An error occured: ' + err);
      	 });
         let level = "None"
        }
        if (exprofile) {

        }
        data.push(helpEmbed = new Discord.RichEmbed());
    		data.push(helpEmbed.setTitle(level));
    		data.push(helpEmbed.setColor(color.blue));
    		data.push(helpEmbed.setTimestamp());
    		data.push(helpEmbed.setAuthor(bot.user.username, bot.user.avatarURL));
      })
    }
}
