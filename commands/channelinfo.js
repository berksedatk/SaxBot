const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
  name: 'channelinfo',
  category: "Utility",
  description: 'Lists the information about a specified channel.',
  usage: '[channel name]',
  cooldown: 5,
  guildOnly: 'true',
  async execute(bot, message, args) {
    if (!args[0]) {
      const channel = message.channel;
      if (channel.parentID === null) {
        const parentName = "null"
      } else {
        const parentName = bot.channels.get(channel.parentID).name
      }
      const channelEmbed = new Discord.RichEmbed()
      .setTitle(`**${channel.name}`)
      .setTimestamp()
      .setColor("BLUE")
      .setFooter("Requested by " + message.author.username, message.author.avatarURL)
      .addField("Type", channel.type)
      .addField("Id", channel.id)
      .addField("Position", channel.position)
      .addField("Nsfw", channel.nsfw)
      .addField("Topic", channel.topic)
      .addField("Category", parentName + `(${channel.parentID})`)
      return message.channel.send(channelEmbed)
    } else if (args[0]) {
      const channels = [];
      const channelName = message.content.slice(14)
      message.guild.channels.map(c => {
        if (c.name === channelName) {
          channels.push(c)
        }
      })

      if (!channels.length) {
        message.channel.send(":x: | Theres no such a channel named like that.")
      } else if (channels.length < 2) {
        const foundChannels = [];
        message.channel.send(`Theres more than one channels called ${channelName}, which one would you want to view? \n\`Smaller value means higher position.\``)
        for (var i = 0; i < channels.length; i++) {
          foundChannels.push(`${i + 1} - Name: ${channels[i].name}, Position: ${channels[i].position}, Category: ${bot.channels.get(channels[i].parentID)}`)
        }
        message.channel.send(foundChannels)
        const filter = m => m.author.id === message.author.id;
        message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
         .then(collected => {
           for (var e = 0; e < channels.length; e++) {
             if (Number(collected.first().content) === e + 1) {
               const channel = channels[e]
               if (channel.parentID === null) {
                 const parentName = "null"
               } else {
                 const parentName = bot.channels.get(channel.parentID).name
               }
               const channelEmbed = new Discord.RichEmbed()
               .setTitle(`**${channel.name}`)
               .setTimestamp()
               .setColor("BLUE")
               .setFooter("Requested by " + message.author.username, message.author.avatarURL)
               .addField("Type", channel.type)
               .addField("Id", channel.id)
               .addField("Position", channel.position)
               .addField("Nsfw", channel.nsfw)
               .addField("Topic", channel.topic)
               .addField("Category", parentName + `(${channel.parentID})`)
               return message.channel.send(channelEmbed)
             }
           }
           return message.channel.send(":x: | Command cancelled.")
         })
         .catch(error => {
           return message.channel.send(":x: | Command cancelled.")
         });
      } else if (channels.length === 1) {
        const channel = channels[0]
        if (channel.parentID === null) {
          const parentName = "null"
        } else {
          const parentName = bot.channels.get(channel.parentID).name
        }
        const channelEmbed = new Discord.RichEmbed()
        .setTitle(`**${channel.name}`)
        .setTimestamp()
        .setColor("BLUE")
        .setFooter("Requested by " + message.author.username, message.author.avatarURL)
        .addField("Type", channel.type)
        .addField("Id", channel.id)
        .addField("Position", channel.position)
        .addField("Nsfw", channel.nsfw)
        .addField("Topic", channel.topic)
        .addField("Category", parentName + `(${channel.parentID})`)
        return message.channel.send(channelEmbed)
      }
    }
  }
}
