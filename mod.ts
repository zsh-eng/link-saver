import { webhookCallback } from 'https://deno.land/x/grammy@v1.21.2/mod.ts';
import bot from './bot.ts';

async function handler(req: Request) {
  const handleUpdate = webhookCallback(bot, 'std/http');
  const token = Deno.env.get('BOT_TOKEN');
  const url = new URL(req.url);

  const isCorrectPath = url.pathname.slice(1) === token;
  if (req.method !== 'POST' || !isCorrectPath) {
    return new Response('Not found', { status: 404 });
  }

  try {
    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
    return new Response('Internal server error', { status: 500 });
  }
}

if (Deno.env.get('ENVIRONMENT') === 'development') {
  console.log('DEV: Bot is up and running!');
  bot.start();
} else {
  console.log('PROD: Bot is up and running!');
  Deno.serve(handler);
}
