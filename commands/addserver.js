const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');
const mongoose = require('mongoose');
const Server = require('../models/server.js');

module.exports = {
  name: 'addserver',
  category: "Utility",
  description: 'Adds a server to database manually.',
  cooldown: 5,
  dev: 'true',
  guildOnly: 'true',
  async execute(bot, message, args) {
    Server.findOne({
      guildID: message.guild.id
    }, (err, dbGuild) => {
      if (dbGuild) return message.channel.send("This server already has a exising database.");
      if (err) return message.channel.send("An error occured: " + err);
      if (!dbGuild) {
        const newGuild = new Server({
          _id: mongoose.Types.ObjectId(),
          guildOwnerID: message.guild.owner.id,
          guildID: message.guild.id,
          guildSettings: [{
            xp: true
          }],
          xpData: [],
          channelData: [],
          roleRewards: []
        });
        newGuild.save().catch(err => {
          return guild.owner.send("An error occured: " + err);
        });
      }
    })
  }
}
