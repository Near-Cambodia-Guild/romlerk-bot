import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN || "")

bot.start((ctx) => {
  ctx.reply('Welcome to Romlerk - រំលឹក');
  ctx.reply(`Chat ID: ${ctx.chat.id}`);
});

// bot.use(async ctx => {
//   const rule = new schedule.RecurrenceRule()
//   rule.minute = [0,15,45]

//   schedule.scheduleJob(rule, () => {
//     ctx.reply(`schedule job`);
//   })

//   schedule.scheduleJob('* * * * *', function(fireDate){
//     ctx.reply('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
//   });
// })

bot.launch()