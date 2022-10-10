import { Telegram } from 'telegraf';
import * as dotenv from 'dotenv';
const axios = require("axios").default;
const { page_id } = require('./constant');
const { isToday } = require('./utils/isToday');

dotenv.config();
const botToken: string = process.env.BOT_TOKEN || "";
const groupID: string = process.env.GROUP_ID || "";
const tg = new Telegram(botToken);

const sendAllResponse = async () => {
    page_id.map((i: any) => {
        const url = `https://api.notion.com/v1/blocks/${i.id}/children`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'Notion-Version': '2022-06-28',
                authorization: `Bearer ${process.env.NOTION_ACCESS_KEY}`
            }
        };

        fetch(url, options)
            .then((res: any) => res.json())
            .then((json: any) => {
                const data = json.results;
                let filter: any = [];
                filter = data.filter((obj: any) => {
                    return obj.to_do !== undefined && isToday({date: obj.last_edited_time})
                })

                const todos = filter.map((i: any) => i.to_do);

                const newArr: any[] = [];
                todos.map((i: any) => {
                    let obj = {};
                    const checked = i?.checked;
                    const plain_text = i?.rich_text[0]?.plain_text;
                    obj = {text: plain_text, checked}
                    newArr.push(obj);
                })
                const filterArr = newArr.filter((obj: any) => {
                    return obj.text !== undefined
                })

                const message = `
                    <b>${i.name} To-dos:</b>\n${filterArr.map((i: any) =>
                        `${(i.checked) ? '✅' : '[ ]'} ${i.text}\n`
                    )}
                `;
                console.log(filterArr);
                
                tg.sendMessage(groupID , message, {parse_mode: 'HTML'});
            })
            .catch((err: any) => console.error('error:' + err));
   })

}

const main = async() => {
    // const rule = baseRule;
    // rule.hour = 17;
    // rule.minute = 0;

    await sendAllResponse();
}

     
main()
        .then( () => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });