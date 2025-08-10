/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUntitledModel = /* GraphQL */ `
  mutation CreateUntitledModel(
    $input: CreateUntitledModelInput!
    $condition: ModelUntitledModelConditionInput
  ) {
    createUntitledModel(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUntitledModel = /* GraphQL */ `
  mutation UpdateUntitledModel(
    $input: UpdateUntitledModelInput!
    $condition: ModelUntitledModelConditionInput
  ) {
    updateUntitledModel(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteUntitledModel = /* GraphQL */ `
  mutation DeleteUntitledModel(
    $input: DeleteUntitledModelInput!
    $condition: ModelUntitledModelConditionInput
  ) {
    deleteUntitledModel(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
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
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
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
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
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
