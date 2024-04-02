import { load } from 'https://deno.land/std@0.221.0/dotenv/mod.ts';
import { GraphQLClient } from 'https://deno.land/x/graphql_request@v4.1.0/mod.ts';
import {
  ArticleSavingRequestResult,
  SaveUrlQueryResponse,
  articleQuery,
  articleSavingRequestQuery,
  endpoint,
  saveUrlQuery,
} from '/omnivore/graphql.ts';
import { createPageFromHtml } from '/telegraph/api.ts';

const env = await load();
const token = env['OMNIVORE_TOKEN'];

class OmnivoreClient {
  private client: GraphQLClient;

  constructor(token: string) {
    this.client = new GraphQLClient(endpoint, {
      headers: {
        Authorization: token,
      },
    });
  }

  async saveUrl(url: string) {
    try {
      const res = await this.client.request({
        document: saveUrlQuery,
        variables: {
          input: {
            clientRequestId: crypto.randomUUID(),
            source: 'api',
            url,
          },
        },
      });

      return res as SaveUrlQueryResponse;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getById(id: string, url: string) {
    try {
      const res = (await this.client.request({
        document: articleSavingRequestQuery,
        variables: {
          id,
          url,
        },
      })) as ArticleSavingRequestResult;

      const article = await this.client.request({
        document: articleQuery,
        variables: {
          username: res.articleSavingRequest.articleSavingRequest.user.name,
          slug: res.articleSavingRequest.articleSavingRequest.slug,
        },
      });

      return article;
    } catch (err) {
      console.error(err);
    }
  }
}

const client = new OmnivoreClient(token);

// const res = await client.saveUrl(
//   'https://www.nytimes.com/2024/03/10/opinion/biden-state-union-message.html'
// );
// console.log(res);

const url =
  'https://omnivore.app/clouded/links/107ddf40-3c73-4733-b4f5-8d967bb4d4d9';
const id = '107ddf40-3c73-4733-b4f5-8d967bb4d4d9';

const res = await client.getById(id, url);
const html = res?.article?.article?.content;
createPageFromHtml(html);
