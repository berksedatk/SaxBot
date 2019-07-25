const Discord = require('discord.js');1

module.exports = {
  name: '8ball',
  category: "Fun",
  description: 'Ask a question! 8ball will answer it.',
  usage: '[question]',
  cooldown: 5,
  async execute(bot, message, args) {
    if (!args[0]) return message.channel.send(":x: | You have to ask a question to 8ball!");

    const yesList = ['Truth','Thats true','Yes, yes it is','Of course'];
    const maybeList = ['Hmm...','Maybe??','I dunno','I wish i knew that','Im not sure'];
    const noList = ['Nope.','Lies!','Uhh... No','Not really','I dont think thats true'];
    const chance = Math.floor(Math.random() * 3)

    let ballEmbed = new Discord.RichEmbed()
    .setTimestamp()
    .setFooter("Requested by " + message.author.username, message.author.avatarURL)
    .setTitle(args)

    if (chance === 0) {
      answer = yesList[Math.floor(Math.random() * yesList.length)]
      ballEmbed.addField("Yes!", answer)
      ballEmbed.setColor("GREEN")
    } else if (chance === 1) {
      answer = maybeList[Math.floor(Math.random() * maybeList.length)]
      ballEmbed.addField("**Maybe...**", answer)
      ballEmbed.setColor("GOLD")
    } else if (chance === 2) {
      answer = noList[Math.floor(Math.random() * noList.length)]
      ballEmbed.addField("**No.**", answer)
      ballEmbed.setColor("RED")
    }

    message.channel.send(ballEmbed)
  }
};
