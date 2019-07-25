const Discord = require('discord.js');1

module.exports = {
  name: '8ball',
  category: "Fun",
  description: 'Ask a question! 8ball will answer it.',
  usage: '[question]',
  cooldown: 5,
  async execute(bot, message, args) {
    if (!args[0]) return message.channel.send(":x: | You have to ask a question to 8ball!");

    yes = ['Truth','Thats true','Yes, yes it is','Of course'];
    maybe = ['Hmm...','Maybe??','I dunno','I wish i knew that','Im not sure'];
    no = ['Nope.','Lies!','Uhh... No','Not really','I dont think thats true'];
    const chance = Math.floor(Math.random() * 3);
    const data = [];

    data.push(ballEmbed = new Discord.RichEmbed())
    data.push(ballEmbed.setTimestamp())
    data.push(ballEmbed.setFooter("Requested by " + message.author.username, message.author.avatarURL))
    data.push(ballEmbed.setTitle(args))

    if (chance === 0) {
      data.push(ballEmbed.setColor("GREEN"))
      ballAnswer = yes[Math.floor(Math.random() * yes.lenght)]
      data.push(ballEmbed.addField("**Yes!**", ballAnswer))
    } else if (chance === 1) {
      data.push(ballEmbed.setColor("GOLD"))
      ballAnswer = maybe[Math.floor(Math.random() * yes.lenght)]
      data.push(ballEmbed.addField("**Maybe...**", ballAnswer))
    } else if (chance === 2) {
      data.push(ballEmbed.setColor("RED"))
      ballAnswer = no[Math.floor(Math.random() * yes.lenght)]
      data.push(ballEmbed.addField("**No.**", ballAnswer))
    }
    data.push(message.channel.send(ballEmbed))
    message.channel.send(data, {split: true})
  }
};
