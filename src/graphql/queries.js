/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUntitledModel = /* GraphQL */ `
  query GetUntitledModel($id: ID!) {
    getUntitledModel(id: $id) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUntitledModels = /* GraphQL */ `
  query ListUntitledModels(
    $filter: ModelUntitledModelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUntitledModels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      untitledfield
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        untitledfield
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
