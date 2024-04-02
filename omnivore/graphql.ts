import { gql } from 'https://deno.land/x/graphql_request@v4.1.0/mod.ts';

export const endpoint = 'https://api-prod.omnivore.app/api/graphql';

export const saveUrlQuery = gql`
  mutation SaveUrl($input: SaveUrlInput!) {
    saveUrl(input: $input) {
      ... on SaveSuccess {
        url
        clientRequestId
      }
      ... on SaveError {
        errorCodes
        message
      }
    }
  }
`;

export type SaveUrlQueryResponse = {
  saveUrl: {
    url: string;
    clientRequestId: string;
  };
};

export const searchQuery = gql`
  query Search($term: String!, $first: Int!, $includeContent: Boolean!) {
    search(query: $term, first: $first, includeContent: $includeContent) {
      ... on SearchSuccess {
        edges {
          cursor
          node {
            id
            title
            author
            description
            image
            url
            content
          }
        }
        pageInfo {
          endCursor
          totalCount
        }
      }
      ... on SearchError {
        errorCodes
      }
    }
  }
`;

// articleSavingRequest(id: ID, url: String): ArticleSavingRequestResult!
export const articleSavingRequestQuery = gql`
  query ArticleSavingRequest($id: ID, $url: String) {
    articleSavingRequest(id: $id, url: $url) {
      ... on ArticleSavingRequestSuccess {
        articleSavingRequest {
          id
          slug
          status
          user {
            id
            name
          }
        }
      }
      ... on ArticleSavingRequestError {
        errorCodes
      }
    }
  }
`;

export type ArticleSavingRequestResult = {
  articleSavingRequest: {
    articleSavingRequest: {
      id: string;
      slug: string;
      status:
        | 'PROCESSING'
        | 'SUCCEEDED'
        | 'FAILED'
        | 'DELETED'
        | 'ARCHIVED'
        | 'CONTENT_NOT_FETCHED';
      user: {
        id: string;
        name: string;
      };
    };
  };
};

// article(username: String!, slug: String!, format: String): ArticleResult!
export const articleQuery = gql`
  query Article($username: String!, $slug: String!) {
    article(username: $username, slug: $slug) {
      ... on ArticleSuccess {
        article {
          id
          title
          author
          description
          image
          url
          content
        }
      }
      ... on ArticleError {
        errorCodes
      }
    }
  }
`;

export type ArticleResult = {
  article: {
    article: {
      id: string;
      title: string;
      author: string;
      description: string;
      image: string;
      url: string;
      content: string;
    };
  };
};
