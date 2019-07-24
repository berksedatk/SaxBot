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

    var ballEmbed = new Discord.RichEmbed()
    .setTimestamp()
    .setFooter("Requested by " + message.author.username, message.author.avatarURL)
    .setTitle(args)

    if (chance === 0) {
      ballEmbed.setColor("GREEN")
      var ballAnswer = yes[Math.floor(Math.random() * yes.lenght)]
      ballEmbed.addField("**Yes!**", ballAnswer)
    } else if (chance === 1) {
      ballEmbed.setColor("GOLD")
      var ballAnswer = maybe[Math.floor(Math.random() * yes.lenght)]
      ballEmbed.addField("**Maybe...**", ballAnswer)
    } else if (chance === 2) {
      ballEmbed.setColor("RED")
      var ballAnswer = no[Math.floor(Math.random() * yes.lenght)]
      ballEmbed.addField("**No.**", ballAnswer)
    }
    message.channel.send(ballEmbed)
  }
};
