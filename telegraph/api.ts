import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts';
import { bodyToNodes } from './md-to-node.ts';

const BASE_URL = 'https://api.telegra.ph';

export async function createPageFromHtml(
  title: string,
  author: string,
  bodyHtml: string
) {
  const token = Deno.env.get('TELEGRAPH_TOKEN');
  if (!token) throw new Error('TELEGRAPH_TOKEN is required');

  const doc = new DOMParser().parseFromString(bodyHtml, 'text/html')!;
  const content = bodyToNodes(doc.body)!;
  const url = new URL('createPage', BASE_URL);

  const res = await fetch(url.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: token,
      title: title,
      author_name: author,
      content,
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.error);
  }
  return data?.result?.url;
}
