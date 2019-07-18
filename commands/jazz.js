const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
  name: 'jazz',
  category: "Fun",
  description: 'Plays jazz music for you.',
  cooldown: 10,
  guildOnly: 'true',
  async execute(bot, message, args) {
    var voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send(":x: | You have to be in a voice channel at first.");

    const number = Math.floor(Math.random() * 5) + 1;
    const jazzMusic = require(`../jazz/${number}.mp3`);

    voiceChannel.join().then(connection => {
      const dispatcher = connection.playFile(jazzMusic);
      message.channel.send(":saxophone: | Playing jazz for you! | :saxophone:")
      dispatcher.on("end", end => {
        voiceChannel.leave()
      });
    }).catch(err => {
      console.log("Connection error: " + err)
      message.channel.send("An error occured: " + err)
    });
  }
}
