import { API, graphqlOperation } from 'aws-amplify';

// GraphQL operations
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
      }
      nextToken
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
    }
  }
`;

// API functions
export const createTodoAPI = async (input: { name: string; description?: string }) => {
  try {
    const result = await API.graphql(graphqlOperation(createTodo, { input }));
    return result;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

export const listTodosAPI = async () => {
  try {
    const result = await API.graphql(graphqlOperation(listTodos));
    return result;
  } catch (error) {
    console.error('Error listing todos:', error);
    throw error;
  }
};

export const updateTodoAPI = async (input: { id: string; name?: string; description?: string }) => {
  try {
    const result = await API.graphql(graphqlOperation(updateTodo, { input }));
    return result;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodoAPI = async (input: { id: string }) => {
  try {
    const result = await API.graphql(graphqlOperation(deleteTodo, { input }));
    return result;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};
