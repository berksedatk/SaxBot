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
    const chance = Math.floor(Math.random() * 3)

    let ballEmbed = new Discord.RichEmbed()
    .setTimestamp()
    .setFooter("Requested by " + message.author.username, message.author.avatarURL)
    .setTitle(args)

    if (chance === 0) {
      answer = Math.floor(Math.random() * yes.lenght)
      ballAnswer = yes[answer]
      ballEmbed.addField("**Yes!**", ballAnswer)
      ballEmbed.setColor("GREEN")
    } else if (chance === 1) {
      answer = Math.floor(Math.random() * maybe.lenght)
      ballAnswer = maybe[answer]
      ballEmbed.addField("**Maybe...**", ballAnswer)
      ballEmbed.setColor("GOLD")
    } else if (chance === 2) {
      answer = Math.floor(Math.random() * no.lenght)
      ballAnswer = no[answer]
      ballEmbed.addField("**No.**", ballAnswer)
      ballEmbed.setColor("RED")
    }

    message.channel.send(ballEmbed)
  }
};
