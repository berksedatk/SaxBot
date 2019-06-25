const Discord = require('discord.js')
const mongoose = require('mongoose');
const config = require('../config.json');
const Profile = require('../models/profile.js');

module.exports = {
    name: 'medals',
    description: 'Shows up your medals.',
    aliases: ['md'],
    usage: '[view] [user mention]',
    cooldown: 5,
    async execute(bot, message, args) {
      mongoose.connect(process.env.DB_TOKEN, { useNewUrlParser: true });

        if (!args[0]) {

            Profile.findOne({
                userID: message.author.id
            }, (err, medals) => {

                if (err) message.channel.send("An error occured: " + err)
                if (!medals) {
                    message.channel.send("It seems like you don't have a profile yet, don't worry we are making a one for you!")

                    const newProfile = new Profile({
                        _id: mongoose.Types.ObjectId(),
                        username: message.author.username,
                        userID: message.author.id,
                        medals: 10,
                        cards: [],
                        inv: []
                    })

                    newProfile.save().catch(err => {
                        message.channel.send("An error occured: " + err)
                        console.log(err)
                    });

                    message.reply("Your profile has been created! Also we added a 10 bonus medals as a gift ;] ")
                } else {
                    message.reply("You have " + medals.medals + " medals in total.")
                };

            })

        }

        //User commands:

        if (args[0] === "view") {

            let membertoadd = message.mentions.members.first().id;
            if (!membertoadd) return message.channel.send("You didnt provide a existing user.")

            Profile.findOne({
                userID: message.mentions.members.first().id
            }, (err, medals) => {

                if (err) return message.channel.send("An error occured: " + err);
                if (!medals) return message.channel.send("This user has no profile set yet.")
                if (medals) {
                    message.channel.send("The user has " + medals.medals + " medals.")
                }
            })
        }

        //Dev commands:

        if (args[0] && config.owners.includes(message.author.id)) {
            if (args[0] === "add") {

                let medalstoadd = Number(args[1]);
                if (!medalstoadd) return message.channel.send("You didnt provide a real number.")

                let memberID = message.mentions.members.first().id;
                if (!memberID) return message.channel.send("You didnt provide a existing user.")

                Profile.findOne({
                    userID: message.mentions.members.first().id
                }, (err, medals) => {

                    if (err) message.channel.send("An error occured: " + err)
                    if (!medals) {
                        message.channel.send("This user has no profile.")
                    } else {

                        medals.medals = medals.medals + medalstoadd

                        medals.save().catch(err => {
                            return message.channel.send("An error occured:" + err)
                        })

                        message.channel.send("Done! Now the user has " + medals.medals + " medals.")
                    }
                })

            } else if (args[0] === "new") {

                let memberID = message.mentions.members.first().id;
                if (!memberID) return message.channel.send("You didnt provide a existing user.")

                Profile.findOne({
                    userID: message.mentions.members.first().id
                }, (err, medals) => {

                    if (err) return message.channel.send("An error occured: " + err);
                    if (!medals) {

                        const newProfile = new Profile({
                            _id: mongoose.Types.ObjectId(),
                            username: message.mentions.members.first().user.username,
                            userID: message.mentions.members.first().id,
                            medals: 10,
                            cards: [],
                            inv: []
                        })

                        newProfile.save().catch(err => {
                            message.channel.send("An error occured: " + err)
                            console.log(err)
                        });

                        message.channel.send("New profile have been created.")

                    }
                    if (medals) {
                        message.channel.send("The user already has a balance with " + medals.medals + " medals.")
                    }

                })

            } else if (args[0] === "remove") {

                let memberID = message.mentions.members.first().id;
                if (!memberID) return message.channel.send("You didnt provide a existing user.")

                Profile.deleteOne({
                    userID: message.mentions.members.first().id
                }, (err) => {

                    if (err) {
                        message.channel.send("An error occured: " + err)
                    } else {
                        message.channel.send("The profile have been removed from database.")
                    }
                })
            }
        }
    }
};
