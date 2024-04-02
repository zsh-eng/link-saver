import { load } from 'https://deno.land/std@0.221.0/dotenv/mod.ts';
import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import { micromark } from 'https://esm.sh/micromark@4.0.0';
import { bodyToNodes } from '/telegraph/md-to-node.ts';

const BASE_URL = 'https://api.telegra.ph';
const env = await load();

const token = env['TELEGRAPH_TOKEN'];
export async function createPageFromHtml(html: string) {
  if (!token) throw new Error('TELEGRAPH_TOKEN is required');

  const doc = new DOMParser().parseFromString(html, 'text/html')!;
  const content = bodyToNodes(doc.body)!;
  const url = new URL('createPage', BASE_URL);

  const res = await fetch(url.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: token,
      title: 'Hello World!',
      content,
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.error);
  }
  return data?.result?.url;
}

export function createPageFromMarkdown(markdownString: string) {
  if (!token) throw new Error('TELEGRAPH_TOKEN is required');
  return createPageFromHtml(micromark(markdownString));
}
