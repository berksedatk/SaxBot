const config = require('../config.json');
const color = require('../data/colors.json');
const emote = require('../data/emotes.json');
const card = require('../data/cards.json');
const items = require('../data/items.json');
const Discord = require('discord.js');

const mongoose = require('mongoose');
const Profile = require('../models/profile.js');

module.exports = {
    name: 'profile',
    description: 'Shows your profile.',
    aliases: ['p'],
    cooldown: 5,
    async execute(bot, message, args) {
        mongoose.connect(process.env.DB_TOKEN, { useNewUrlParser: true });
        const msg = await message.channel.send(` ${emote.loading} Gathering resources...`);

        //User commands:

        if (args[0] === "inv") {
          if (args[1]) {
            try {
              const memberID = message.mentions.members.first().id
            } catch(err) {
              return msg.edit("You didnt provide a existing user.")
            }
            Profile.findOne({
              userID: message.mentions.members.first().id
            }, (err, profile) => {
              if (!profile.inv[0]) {
                return msg.edit("This user doesn't owns any items.");
              } else {
                const itemID = [];
                const data = [];
                data.push("Here is the list of items that the user own: \n")
                profile.inv.map(i => {
                    itemID.push(i)
                })
                items.items.forEach(i => {
                    if (itemID.includes(i.id)) {
                        data.push(" -**" + i.name + "**");
                    }
                })
                msg.edit(data, { split: true })
              }
            })
          } else {
            Profile.findOne({
                userID: message.author.id
            }, (err, profile) => {
                if (err) return message.channel.send("An error occured: " + err)
                if (!profile) {
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
                    })
                    msg.edit("Your profile has been created! Also we added a 10 bonus medals as a gift ;], but sadly you don't own any items :[")
                } else if (profile.inv[0]) {
                    const cardID = [];
                    const data = [];
                    data.push("Here is the list of items that you own: \n")
                    profile.inv.map(i => {
                        cardID.push(i)
                    });
                    items.items.forEach(i => {
                        if (cardID.includes(i.id)) {
                            data.push(" -**" + i.name + "**");
                        }
                    });
                    msg.edit(data, { split: true })
                } else {
                    msg.edit("You don't own any items.")
                }
            })
          }
        } else if (args[0] === "cards") {
          let typeList = ['common','uncommon','rare','epic','legendary'];
          if (args[1]) {
            try {
              const memberID = message.mentions.members.first().id
            } catch(err) {
              return msg.edit("You didnt provide a existing user.")
            }
            Profile.findOne({
              userID: message.mentions.members.first().id
            }, (err, profile) => {
              if (!profile.cards[0]) {
                return msg.edit("This user doesn't owns any cards.");
              } else {
                const cardID = [];
                const data = [];
                data.push("Here is the list of cards that the user own: \n")
                profile.cards.map(c => {
                    cardID.push(c)
                })
                card.cards.forEach(c => {
                    if (cardID.includes(c.id)) {
                        data.push(" -Name: **" + c.name + "** Id: **" + c.id + "** ");
                    }
                })
                msg.edit(data, { split: true })
              }
            })
          } else {
            Profile.findOne({
                userID: message.author.id
            }, (err, profile) => {
                if (err) return message.channel.send("An error occured: " + err)
                if (!profile) {
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
                    })
                    msg.edit("Your profile has been created! Also we added a 10 bonus medals as a gift ;], but sadly you don't own any cards :[")
                } else if (profile.cards[0]) {
                    const cardID = [];
                    const data = [];
                    data.push("Here is the list of cards that you own: \n")
                    profile.cards.map(c => {
                        cardID.push(c)
                    });
                    card.cards.forEach(c => {
                        if (cardID.includes(c.id)) {
                            data.push(" -Name: **" + c.name + "** Id: **" + c.id + "** ");
                        }
                    });
                    msg.edit(data, { split: true })
                } else {
                    msg.edit("You don't own any cards.")
                }
            })
          }
        } else if (args[0] === "medals") {
          if (args[1]) {
            try {
              const memberID = message.mentions.members.first().id
            } catch(err) {
              return msg.edit("You didnt provide a existing user.")
            }
            Profile.findOne({
                userID: message.mentions.members.first().id
            }, (err, profile) => {
                if (err) message.channel.send("An error occured: " + err)
                if (!profile) return msg.edit("This user has no profile set yet.")
                if (profile) return msg.edit("This user has " + profile.medals + " :medal: medals in total.")
            })
          } else {
            Profile.findOne({
                userID: message.author.id
            }, (err, profile) => {
                if (err) message.channel.send("An error occured: " + err)
                if (!profile) {
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
                    let cardsData = [];
                    if (!profile.cards[0]) {
                      cardsData = "No cards."
                    } else {
                      profile.cards.map(c => {
                        card.cards.map(cd => {
                          if (cd.id === c) {
                            cardsData.push(cd.name)
                          }
                        })
                      })
                    }
                    let invData = [];
                    if (!profile.inv[0]) {
                      invData = "No items."
                    } else {
                      profile.inv.map(i => {
                        items.items.map(it => {
                          if (it.id === i) {
                            invData.push(it.name)
                          }
                        })
                      })
                    }
                    const profileEmbed = new Discord.RichEmbed()
                      .setTitle("-Profile-")
                      .setColor(color.green)
                      .setThumbnail(message.mentions.members.first().username)
                      .setTimestamp()
                      .addField("Name", message.author.username)
                      .addField("Medals", profile.medals + " :medal:")
                      .addField("Cards", cardsData)
                      .addField("Inventory", invData)
                    message.reply("Your profile has been created! Also we added a 10 bonus medals as a gift ;]")
                    message.channel.send(profileEmbed)
                } else {
                    msg.edit("You have " + profile.medals + " :medal: medals in total.")
                };
            })
          }
        } else if (args[0] === "view") {
          try {
            const memberID = message.mentions.members.first().id
          } catch(err) {
            return msg.edit("You didnt provide a existing user.")
          }
          Profile.findOne({
            userID: message.mentions.members.first().id
          },(err, profile) => {
            if (err) return message.channel.send("An error occured: " + err);
            if (!profile) return msg.edit("This user has no profile set yet.");
            if (profile) {
              let cardsData = [];
              if (!profile.cards[0]) {
                cardsData = "No cards."
              } else {
                profile.cards.map(c => {
                  card.cards.map(cd => {
                    if (cd.id === c) {
                      cardsData.push(cd.name)
                    }
                  })
                })
              }
              let invData = [];
              if (!profile.inv[0]) {
                invData = "No items."
              } else {
                profile.inv.map(i => {
                  items.items.map(it => {
                    if (it.id === i) {
                      invData.push(it.name)
                    }
                  })
                })
              }
              const profileEmbed = new Discord.RichEmbed()
                .setTitle("-Profile-")
                .setColor(color.green)
                .setThumbnail(message.mentions.members.first().username)
                .setTimestamp()
                .addField("Name", message.author.username)
                .addField("Medals", profile.medals + " :medal:")
                .addField("Cards", cardsData)
                .addField("Inventory", invData)
                msg.edit(profileEmbed)
            }
          })
        } else if (!args[0]) {
          Profile.findOne({
            userID: message.author.id
          }, (err, profile) => {
            if (err) return message.channel.send("An error occured: " + err);
            if (!profile) {
              msg.edit("It seems like you don't have a profile set yet, don't worry we are making a new one for you!")
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
              })
              message.reply("Your profile has been created! Also we added a 10 bonus medals as a gift ;] ")
            }
            if (profile) {
              let cardsData = [];
              if (!profile.cards[0]) {
                cardsData = "No cards."
              } else {
                profile.cards.map(c => {
                  card.cards.map(cd => {
                    if (cd.id === c) {
                      cardsData.push(cd.name)
                    }
                  })
                })
              }
              let invData = [];
              if (!profile.inv[0]) {
                invData = "No items."
              } else {
                profile.inv.map(i => {
                  items.items.map(it => {
                    if (it.id === i) {
                      invData.push(it.name)
                    }
                  })
                })
              }
              const profileEmbed = new Discord.RichEmbed()
                .setTitle("-Profile-")
                .setColor(color.green)
                .setThumbnail(message.author.avatarURL)
                .setTimestamp()
                .addField("Name", message.author.username)
                .addField("Medals", profile.medals + " :medal:")
                .addField("Cards", cardsData)
                .addField("Inventory", invData)
                msg.edit(profileEmbed)
            }
          })
        }

        //Dev commands:

        if (args[0] && config.owners.includes(message.author.id)) {
          message.channel.send("Dev command detected.")
          if (args[0] === "new") {
            msg.edit("Creating a new profile.")
            try {
              const memberID = message.mentions.members.first().id
            } catch(err) {
              return msg.edit("You didnt provide a existing user.")
            }
            Profile.findOne({
                userID: message.mentions.members.first().id
            }, (err, profile) => {
                if (err) return message.channel.send("An error occured: " + err);
                if (!profile) {
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
                    msg.edit("New profile have been created.")
                }
                if (profile) {
                    msg.edit("The user already has a profile.");
                }
            })
          } else if (args[0] === "edit") {
            if (!args[1]) {
              msg.edit("Please select which action to take. `medals, inv or cards`");
            } else if (args[1] === "medals") {
              if (args[2] === "add") {
                let medalstoadd = Number(args[3]);
                if (!medalstoadd) return message.channel.send("You didnt provide a real number.");
                let memberID = message.mentions.members.first().id;
                if (!memberID) return message.channel.send("You didnt provide a existing user.");
                Profile.findOne({
                  userID: memberID
                }, (err, profile) => {
                  if (err) return message.channel.send("An error occured: " + err);
                  if (!profile) return message.channel.send("This user has no profile yet.");
                  if (profile) {
                    profile.medals += medalstoadd
                    profile.save().catch(err => {
                        return message.channel.send("An error occured:" + err);
                    });
                    message.channel.send("Done, now user has " + profile.medals + " medals.");
                  }
                });
              }
            } else if (args[1] === "inv") {
              if (args[2] === "add") {
                try {
                    const memberID = message.mentions.members.first().id;
                } catch (err) {
                    return message.channel.send("You didnt provide a existing user.")
                }
                const idnumber = Number(args[3]) - 1
                const item = item.items[idnumber.toString()]
                Profile.findOne({
                  userID: memberID
                }, (err, profile) => {
                  profile.inv.push(item.id)
                  profile.save().catch(err => {
                    message.channel.send("An error occured: " + err)
                  })
                  msg.edit("The item have been added succesfully.")
                })
              } else if (args[2] === "rem") {
                msg.edit("This is not working correctly, you have to do it manually.")
              }
            } else if (args[1] === "cards") {
              if(args[2] === "add") {
                try {
                    const memberID = message.mentions.members.first().id;
                } catch (err) {
                    return msg.edit("You didnt provide a existing user.")
                }
                let counter = 0;
                card.cards.map(c => {
                    if (c.id === args[1]) {
                        msg.edit("Added the card with id: " + c.id)
                        counter += 1;
                    }
                })
                if (counter !== 1) msg.edit("You didnt provide a true card id.")
                Profile.findOne({
                    userID: message.mentions.members.first().id
                }, (err, profile) => {
                    if (err) return message.channel.send("An error occured: " + err)
                    if (!profile) {
                        return msg.edit("This user has no card deck yet.")
                    } else {
                        profile.cards.push(args[1])
                        profile.save().catch(err => {
                            message.channel.send("An error occured: " + err)
                        })
                    }
                })
              }
            }
          }
        }
    }
}
