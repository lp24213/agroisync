/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUntitledModel = /* GraphQL */ `
  subscription OnCreateUntitledModel(
    $filter: ModelSubscriptionUntitledModelFilterInput
  ) {
    onCreateUntitledModel(filter: $filter) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUntitledModel = /* GraphQL */ `
  subscription OnUpdateUntitledModel(
    $filter: ModelSubscriptionUntitledModelFilterInput
  ) {
    onUpdateUntitledModel(filter: $filter) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUntitledModel = /* GraphQL */ `
  subscription OnDeleteUntitledModel(
    $filter: ModelSubscriptionUntitledModelFilterInput
  ) {
    onDeleteUntitledModel(filter: $filter) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onCreateTodo(filter: $filter) {
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
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onUpdateTodo(filter: $filter) {
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
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
    onDeleteTodo(filter: $filter) {
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
