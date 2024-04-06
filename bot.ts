import { Bot } from 'https://deno.land/x/grammy@v1.21.2/mod.ts';
import {
  FAILED_TO_SAVE_ARTICLE,
  SUCCEEDED_TO_SAVE_ARTICLE,
} from './messages.ts';
import { getArticleFromHTML } from './reader.ts';
import { createPageFromHtml } from './telegraph/api.ts';
import { load } from 'https://deno.land/std@0.221.0/dotenv/mod.ts';
// Handle .env
const env = await load();
if (!Deno.env.has('BOT_TOKEN')) {
  if (!env.BOT_TOKEN || !env.TELEGRAPH_TOKEN) {
    console.error('BOT_TOKEN and TELEGRAPH_TOKEN are required in .env file.');
    Deno.exit(1);
  }

  Deno.env.set('BOT_TOKEN', env.BOT_TOKEN);
  Deno.env.set('TELEGRAPH_TOKEN', env.TELEGRAPH_TOKEN);

  if (env.ENVIRONMENT) {
    console.log(
      'Environment flag detected. Setting environment variable to',
      env.ENVIRONMENT
    );
    Deno.env.set('ENVIRONMENT', env.ENVIRONMENT);
  }
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
  if (url.match(/https?:\/\/telegra\.ph\/.+/)) {
    console.log('Telegraph URL');
    ctx.reply('You sent me a Telegraph URL. Please send me an article URL.');
    return;
  }

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
  ctx.reply(`${telegraphUrl}`);
});

export default bot;
