'use client';

import React, { useState, useEffect } from 'react';
import { createTodoAPI, listTodosAPI, updateTodoAPI, deleteTodoAPI } from '../lib/graphql';

interface Todo {
  id: string;
  name: string;
  description?: string;
  untitledfield?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TodoManager() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const result: any = await listTodosAPI();
      if (result.data?.listTodos?.items) {
        setTodos(result.data.listTodos.items);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.name.trim()) return;

    try {
      setLoading(true);
      await createTodoAPI({
        name: newTodo.name,
        description: newTodo.description || undefined
      });
      
      setNewTodo({ name: '', description: '' });
      await loadTodos(); // Reload the list
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodo = async (id: string) => {
    if (!editForm.name.trim()) return;

    try {
      setLoading(true);
      await updateTodoAPI({
        id,
        name: editForm.name,
        description: editForm.description || undefined
      });
      
      setEditingId(null);
      setEditForm({ name: '', description: '' });
      await loadTodos(); // Reload the list
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;

    try {
      setLoading(true);
      await deleteTodoAPI({ id });
      await loadTodos(); // Reload the list
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditForm({ name: todo.name, description: todo.description || '' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-600">
        🚀 AGROTM - Gerenciador de Conteúdo
      </h1>
      
      {/* Create Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Criar Novo Registro</h2>
        <form onSubmit={handleCreateTodo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <input
              type="text"
              value={newTodo.name}
              onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Digite o nome"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Digite a descrição"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando...' : 'Criar Registro'}
          </button>
        </form>
      </div>

      {/* Todos List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Registros Existentes</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum registro encontrado.</p>
            <p className="text-sm">Crie seu primeiro registro acima!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div key={todo.id} className="border border-gray-200 rounded-lg p-4">
                {editingId === todo.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateTodo(todo.id)}
                        disabled={loading}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{todo.name}</h3>
                    {todo.description && (
                      <p className="text-gray-600 mt-1">{todo.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm text-gray-500">
                        Criado: {new Date(todo.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(todo)}
                          className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 text-sm"
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
