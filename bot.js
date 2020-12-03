require("dotenv").config();

const Discord = require("discord.js");
const bot = new Discord.Client();
const weather = require("weather-js");

// global settings
const prefix = "!"; // prefix for all the commands

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (message) => {
  let msg = message.content.toUpperCase(); // takes message and turns it to all upper case , so that the command isnt case sensetive
  let sender = message.author; // finds the sender of the message
  let cont = message.content.slice(prefix.length).split(" "); // slices of the prefix of the message and saves the rest inside an array
  let args = cont.slice(1); // slices of the command leaving only the argumetns

  if (msg === "PING") {
    message.reply("Pong!");
  }

  if (msg === 'I LOVE HUE') {
      message.react('❤️')
  }

  if (msg.startsWith(prefix + "WEATHER")) {
    // This checks to see if the beginning of the message is calling the weather command.
    // You can find some of the code used here on the weather-js npm page in the description.

    try {
      weather.find(
        { search: args.join(" "), degreeType: "C" },
        function (err, result) {
          // Make sure you get that args.join part, since it adds everything after weather.
          if (err) message.channel.send(err);

          // We also want them to know if a place they enter is invalid.
          if (result.length === 0) {
            message.channel.send("**Please enter a valid location.**"); // This tells them in chat that the place they entered is invalid.
            return; // This exits the code so the rest doesn't run.
          }

          // Variables
          var current = result[0].current; // This is a variable for the current part of the JSON output
          var location = result[0].location; // This is a variable for the location part of the JSON output

          // Let's use an embed for this.
          const embed = new Discord.MessageEmbed()
            .setDescription(`**${current.skytext}**`) // This is the text of what the sky looks like, remember you can find all of this on the weather-js npm page.
            .setAuthor(`Weather for ${current.observationpoint}`) // This shows the current location of the weather.
            .setThumbnail(current.imageUrl) // This sets the thumbnail of the embed
            .setColor(0x00ae86) // This sets the color of the embed, you can set this to anything if you look put a hex color picker, just make sure you put 0x infront of the hex
            .addField("Timezone", `UTC${location.timezone}`, true) // This is the first field, it shows the timezone, and the true means `inline`, you can read more about this on the official discord.js documentation
            .addField("Degree Type", location.degreetype, true) // This is the field that shows the degree type, and is inline
            .addField("Temperature", `${current.temperature} Degrees`, true)
            .addField("Feels Like", `${current.feelslike} Degrees`, true)
            .addField("Winds", current.winddisplay, true)
            .addField("Humidity", `${current.humidity}%`, true);

          // Now, let's display it when called
          message.channel.send({ embed });
        }
      );
    } catch (error) {
      message.channel.send("WTF");
    }
  }
});

bot.login(process.env.BOT_TOKEN);
