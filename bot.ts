import { load } from 'https://deno.land/std@0.221.0/dotenv/mod.ts';
import { Bot } from 'https://deno.land/x/grammy@v1.21.2/mod.ts';
import {
  FAILED_TO_SAVE_ARTICLE,
  SUCCEEDED_TO_SAVE_ARTICLE,
} from './messages.ts';
import { getArticleFromHTML } from './reader.ts';
import { createPageFromHtml } from './telegraph/api.ts';

const env = await load();
if (!Deno.env.has('BOT_TOKEN')) {
  Deno.env.set('BOT_TOKEN', env.BOT_TOKEN);
  Deno.env.set('TELEGRAPH_TOKEN', env.TELEGRAPH_TOKEN);
}

const bot = new Bot(Deno.env.get('BOT_TOKEN')!);
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));

// Handle URL messages
bot.on('message:entities:url', async (ctx) => {
  const urlEntity = ctx.message.entities.find((e) => e.type === 'url')!;
  const url = ctx.message.text.slice(
    urlEntity.offset,
    urlEntity.offset + urlEntity.length
  );
  const html = await fetch(url).then((res) => res.text());
  const article = getArticleFromHTML(html);

  if (!article?.content) {
    console.log(FAILED_TO_SAVE_ARTICLE);
    ctx.reply(FAILED_TO_SAVE_ARTICLE);
    return;
  }

  const telegraphUrl = await createPageFromHtml(
    article.title ?? 'Untitled',
    article.byline ?? 'Anonymous',
    article.content ?? ''
  );

  console.log(SUCCEEDED_TO_SAVE_ARTICLE, telegraphUrl);
  ctx.reply(`You sent me a URL: ${telegraphUrl}`);
});

// Handle other messages.
// bot.on('message', (ctx) => ctx.reply('Got another message!'));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
// Start the bot.
console.log('Bot is up and running!');
bot.start();
