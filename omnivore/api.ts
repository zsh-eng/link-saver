import { GraphQLClient } from 'https://deno.land/x/graphql_request@v4.1.0/mod.ts';
import {
  ArticleResult,
  ArticleSavingRequestResult,
  SaveUrlQueryResponse,
  articleQuery,
  articleSavingRequestQuery,
  endpoint,
  saveUrlQuery,
} from '/omnivore/graphql.ts';

export class OmnivoreClient {
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

  async isArticleSavingRequestSuccess(
    id: string,
    url: string
  ): Promise<boolean> {
    try {
      const res = (await this.client.request({
        document: articleSavingRequestQuery,
        variables: {
          id,
          url,
        },
      })) as ArticleSavingRequestResult;

      const data = res.articleSavingRequest.articleSavingRequest;
      return data.status === 'SUCCEEDED';
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async getArticleById(id: string, url: string) {
    try {
      const res = (await this.client.request({
        document: articleSavingRequestQuery,
        variables: {
          id,
          url,
        },
      })) as ArticleSavingRequestResult;

      const articleRes = (await this.client.request({
        document: articleQuery,
        variables: {
          username: res.articleSavingRequest.articleSavingRequest.user.name,
          slug: res.articleSavingRequest.articleSavingRequest.slug,
        },
      })) as ArticleResult;

      return articleRes?.article?.article;
    } catch (err) {
      console.error(err);
    }
  }

  async saveUrlAndGetArticleHtml(url: string) {
    const res = await this.saveUrl(url);
    const omnivoreUrl = res.saveUrl.url;
    const id = res.saveUrl.clientRequestId;

    let retriesLeft = 5;
    while (retriesLeft > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const success = await this.isArticleSavingRequestSuccess(id, omnivoreUrl);
      if (success) {
        return await this.getArticleById(id, url);
      }
      retriesLeft--;
    }
  }
}
