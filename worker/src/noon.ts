import { Telegram } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();
dotenv.config();
const botToken: string = process.env.BOT_TOKEN || "";
const groupID: string = process.env.GROUP_ID || "";
const tg = new Telegram(botToken);

const main = async () => {

    const message = `Hi there!🥰.\nHow was your day? let's <i>រំលឹក | Romlerk</i> know <b>what you have done today.</b>`;
        await tg.sendMessage(
            groupID, 
            message,
            {   
                reply_markup: {
                    inline_keyboard: [
                        [{ 
                            text: "Update To-dos", 
                            url: "https://radical-rocket-3f0.notion.site/ac7d5125e0eb4fe58cf8e23bc53c56f1?v=724e4384cd514d8cbb0a35de9f134746" 
                        }]
                    ]
                }, 
                parse_mode: 'HTML'
            }
        );
    }
     
    main()
            .then( () => process.exit(0))
            .catch(error => {
                console.error(error);
                process.exit(1);
            });