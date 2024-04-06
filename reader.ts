import {
  Readability,
  isProbablyReaderable,
} from 'https://deno.land/x/readenobility@0.5.1-rc.11/mod.js';
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts';

export function getArticleFromHTML(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')!;
  if (!isProbablyReaderable(doc)) {
    console.error('Document is not readerable');
    return null;
  }

  const reader = new Readability(doc);
  const article = reader.parse();
  return article;
}
