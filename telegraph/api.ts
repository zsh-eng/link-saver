import { load } from 'https://deno.land/std@0.221.0/dotenv/mod.ts';
import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import { bodyToNodes } from '/telegraph/md-to-node.ts';
import { micromark } from 'https://esm.sh/micromark';

const BASE_URL = 'https://api.telegra.ph';
const env = await load();

const teststring = `
## Deno

[[Deno]]


## Supabase

I have to set up the Supabase tables and project.
Details are not provided in the documentation.


## Grammy

### Sessions

[Sessions and Storing Data (built-in) | grammY](https://grammy.dev/plugins/session.html)
Sessions are necessary because Telegram bots don't manage sessions - i.e. doesn't have access to old messages.

`;

const token = env['TELEGRAPH_TOKEN'];
async function createPage(markdownString: string) {
  if (!token) throw new Error('TELEGRAPH_TOKEN is required');

  const doc = new DOMParser().parseFromString(
    micromark(markdownString.replace(/\n/g, '\r\n')),
    'text/html'
  )!;
  const content = bodyToNodes(doc.body)!;
  const url = new URL('createPage', BASE_URL);

  console.log(JSON.stringify(content));

  const params = new URLSearchParams();
  params.set('access_token', token);
  params.set('title', 'Hello World!');
  params.set('content', JSON.stringify(content));
  url.search = params.toString();

  const res = await fetch(url.href, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  console.log(data);
}

createPage(teststring);
