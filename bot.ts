import { Bot } from 'https://deno.land/x/grammy@v1.21.2/mod.ts';
import { load } from 'https://deno.land/std@0.221.0/dotenv/mod.ts';

const env = await load();
const bot = new Bot(env['BOT_TOKEN']);

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
// Handle other messages.
bot.on('message', (ctx) => ctx.reply('Got another message!'));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
