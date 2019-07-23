const Discord = require('discord.js');

module.exports = {
  name: '8ball',
  category: "Fun",
  description: 'Ask a question! 8ball will answer it.',
  usage: '[question]',
  cooldown: 5,
  async execute(bot, message, args) {
    const yes = ['Truth','Thats true','Yes, yes it is','Of course'];
    const maybe = ['Hmm...','Maybe??','I dunno','I wish i knew that','Im not sure'];
    const no = ['Nope.','Lies!','Uhh... No','Not really','I dont think thats true'];
    const chance = Math.floor(Math.random() * 100);
    var answer;
    var title = ""
    var color = ""
    if (chance > 65) {
      title = "**Yes!**"
      color = "GREEN"
      answer = yes[Math.floor(Math.random() * yes.lenght)]
    }
    if (chance > 33 && chance < 66) [
      title = "**Maybe...**"
      color = "GOLD"
      answer = maybe[Math.floor(Math.random() * maybe.lenght)]
    }
    if (chance < 34) {
      title = "**No.**"
      color = "RED"
      answer = no[Math.floor(Math.random() * no.lenght)]
    }

    let ballEmbed = Discord.RichEmbed()
      .setTitle(title)
      .setTimestamp()
      .setColor(color)
      .setFooter("Requested by " + message.author.username, message.author.avatarURL)
      .setDescription(answer)
  }
};
