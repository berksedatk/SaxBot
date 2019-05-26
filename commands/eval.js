const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');
const emote = require('../data/emotes.json');
const { inspect } = require("util");
const { post } = require("snekfetch");

module.exports = {
    name: 'eval',
    description: 'Executes a command. DEV ONLY.',
    aliases: ['eveal','execute'],
    usage: '[code]',
    dev: 'true',
    async execute(bot, message, args) {

    const msg = await message.channel.send(`${emote.loading} Executing code...`);

    const code = args.join(" ");

    try {
    	  if (code.includes(process.env.BOT_TOKEN)) {
        return message.channel.send("Not today.");
      }
      let output = eval(code);
      if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
      output = inspect(output, { depth: 0, maxArrayLength: null });
      output = clean(output);
      if (output.length < 1000) {
        const embed = new Discord.RichEmbed()
          .addField("Input", `\`\`\`js\n${code}\`\`\``)
          .addField("Output", `\`\`\`js\n${output}\`\`\``)
          .setColor(color.invisible);
        msg.edit(embed);
      } else {
        const { body } = await post("https://www.hastebin.com/documents").send(output);
        const embed = new Discord.RichEmbed()
          .setTitle("Output was too long, uploaded to hastebin!")
          .setURL(`https://www.hastebin.com/${body.key}.js`)
          .setColor(color.invisible);
        msg.edit(embed);
      }
    } catch (e) {
      message.channel.send(`Error \`\`\`js\n${e}\`\`\``);
    }
  }
}

function clean (text) {
 return text
 .replace(/`/g, "`" + String.fromCharCode(8203))
 .replace(/@/g, "@" + String.fromCharCode(8203));
}
