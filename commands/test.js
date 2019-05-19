const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
    name: 'test',
    description: 'Test',
    aliases: ['tests'],
    usage: '[test]',
    cooldown: 5,
    dev: 'true',
    async execute(bot, message, args) {
    	message.channel.send("Testing.")
    }
}
