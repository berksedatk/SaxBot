const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');
const prefix = config.prefix;

module.exports = {
    name: 'ban',
    description: 'Bans a specified user for a specified reason.',
    usage: '[mention] [reason]',
    cooldown: 5,
    dev: 'true',
    async execute(bot, message, args) {


      
    }
}
