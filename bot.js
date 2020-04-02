const Telegraf = require('telegraf');

const bot = new Telegraf('511254746:AAHVcubBus03qqMQ0wXxJoNTJJRHHJgBQ2c');

const Extra = require('telegraf/extra');

const Markup = require('telegraf/markup')

const axios = require('axios');

// TO BE FIXED - It's ugly. 
// Returns a date in specific format ex.YYYY/MM/DD
var today = new Date();
var dd = today.getDate();

var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
today = yyyy+'-'+mm+'-'+dd;


bot.start((ctx) => ctx.reply(`🤚🏼Hi there, ${ctx.message.from.first_name} ${ctx.message.from.last_name}!🤚🏼\n🤖I am CoronaVirus Information Bot.🤖\n\n\nℹ️How can I be of any help?ℹ️\n\n✅<b>List of all commands supported by me:</b>✅\n📌<b>/help</b> - to get full list of supported commands.\n📌<b>/cases</b> - to get the number of cases globally.\n📌<b>/cases country_name</b> - to get the number of total cases and today cases.\n📌<b>/deaths</b> - to get the number of deaths globally.\n📌<b>/deaths country_name</b> - to get the number of deaths in specific country.\n\n📣Thank you for joining!📣`, Extra.HTML()));

//Handle positive total cases globally and positive cases for specific country {input}
bot.command('infected', async (ctx) => {
    let input = ctx.message.text
    let inputArray = input.split(" ");

    if (inputArray.length == 1) {
        try {
        let res = await axios.get(`https://coronavirus-19-api.herokuapp.com/all`);
        ctx.reply(`🦠🦠🦠🦠Here's world results:🦠🦠🦠🦠\n      🤒<b>Total Cases: ${res.data.cases}</b>🤒\n      💀<b>Total Deceased:</b> ${res.data.deaths}💀\n      💊<b>Total Recovered:</b> ${res.data.recovered}💊`, Extra.HTML());
        } catch (e) {
            console.log(e);
        }
    } else {
        inputArray.shift();
        input = inputArray.join(" ").toUpperCase();
        res = await axios.get(`https://coronavirus-19-api.herokuapp.com/countries/${input}`);
        if (res.data == "Country not found") {
            ctx.reply('Country not found. Please try again!');
        }
        else {
            ctx.reply(`🦠Here's the results for selected country:🦠\n🚩🚩🚩🚩<b>Country - ${input}</b>🚩🚩🚩🚩\n<b>Total Cases:</b>${res.data.cases}\n<b>Today Cases</b> = ${res.data.todayCases}
            `, Extra.HTML());
        }

    }
})

//Handle positive total cases globally and positive cases for specific country {input}
bot.command('deceased', async (ctx) => {
    let input = ctx.message.text
    let inputArray = input.split(" ");

    if (inputArray.length == 1) {
        try {
        let res = await axios.get(`https://coronavirus-19-api.herokuapp.com/all`);
        ctx.reply(res.data.deaths);
        } catch (e) {
            console.log(e);
        }
    } else {
        inputArray.shift();
        input = inputArray.join(" ").toUpperCase();
        res = await axios.get(`https://coronavirus-19-api.herokuapp.com/countries/${input}`);
        if (res.data == "Country not found") {
            ctx.reply('Country not found. Please try again!');
        }
        else {
            ctx.reply(`🦠Here's the results for the selected country:🦠\n🚩🚩🚩🚩<b>Country - ${input}</b>🚩🚩🚩🚩\n<b>Total Deceased:</b>${res.data.deaths}\n<b>Today Cases</b> = ${res.data.todayDeaths}
            `, Extra.HTML());
        }

    }
})

//Get news updated related to COVID-19
bot.command('news', async (ctx) => {
    axios.get('https://newsapi.org/v2/everything?q=covid&apiKey=ff867f327ffe4db59140933f167a1141')
      .then(res => {
        //ctx.reply(res.data.articles[0].title);
        ctx.replyWithPhoto(res.data.articles[0].urlToImage)
        console.log(res.data.articles[0].title);
      }).catch(e => {
          console.log(e);
      })
})

// Handle sticker or photo update
bot.on(['sticker', 'photo'], (ctx) => {
    return ctx.reply('Cool! I like that, but I got no responde for that!')
  })

bot.launch();