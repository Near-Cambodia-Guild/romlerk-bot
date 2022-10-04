import { Telegram } from 'telegraf';
import schedule from 'node-schedule';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config()
const botToken = process.env.BOT_TOKEN || "";
const groupID = process.env.GROUP_ID || "";
const tg = new Telegram(botToken)

const baseRule = new schedule.RecurrenceRule();
baseRule.tz = 'UTC+7';
baseRule.dayOfWeek = new schedule.Range(1, 5);
baseRule.minute = 0;

const sendReminder = () => {
    const rule = baseRule;
    rule.hour = 9;
    rule.minute = 0;

    schedule.scheduleJob(rule, () => {
        const message = "Sending a reminder attached with button, that button lead to private chat to bot.";
        console.log(message);
        tg.sendMessage(groupID, message);
    });
}

const sendPMCheckpoints = () => {
    const rule = baseRule;
    rule.hour = 16;
    rule.minute = 30;

    schedule.scheduleJob(rule, () => {
        // query todo list from all members
        const message = "Send reminder to user to update todo list or what goal that accomplish.";
        console.log(message);
        // loop through each members and send the todo list to update
            tg.sendMessage(groupID, message); // change to chatID instead
    });
}

const sendAllResponse = () => {
    const rule = baseRule;
    rule.hour = 17;
    rule.minute = 0;

    schedule.scheduleJob(rule, () => {
        // again, query todo list from all members
        const message = "send all response to group, How many percentage user complete their goal and what are those to do list.";
        console.log(message);
        // calculate the completion of today for each members, then response to the group
        tg.sendMessage(groupID, message);
    });
}

sendReminder();
sendPMCheckpoints();
sendAllResponse();