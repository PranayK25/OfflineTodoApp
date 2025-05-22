import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';
import {Todo} from '../types/todo';

const API_URL = 'http://jsonplaceholder.typicode.com/todos';
const STORAGE_KEY = '@todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const {isConnected} = useNetInfo();

  const loadFromStorage = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  };

  const saveToStorage = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {'Content-Type': 'application/json'},
      });
      const data = await response.json();

      const syncedTodos = data.map((todo: Todo) => ({
        ...todo,
        synced: true,
      }));

      setTodos(syncedTodos);
      saveToStorage(syncedTodos);
    } catch (error) {
      await loadFromStorage();
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      userId: 1,
      title,
      completed: false,
      synced: false,
    };

    setTodos(prev => [...prev, newTodo]);
    await saveToStorage([...todos, newTodo]);
  };

  const updateTodo = async (id: number, changes: Partial<Todo>) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? {...todo, ...changes, synced: false} : todo,
    );
    setTodos(updatedTodos);
    await saveToStorage(updatedTodos);
  };

  const deleteTodo = async (id: number) => {
    const filteredTodos = todos.filter(todo => todo.id !== id);
    setTodos(filteredTodos);
    await saveToStorage(filteredTodos);
  };

  const toggleTodo = (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      updateTodo(id, {completed: !todo.completed});
    }
  };

  useEffect(() => {
    fetchTodos();
    if (isConnected) {
      setIsSyncing(true);
    }
  }, [isConnected]);

  return {
    todos,
    loading,
    isSyncing,
    isOffline: !isConnected,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refreshTodos: fetchTodos,
  };
};
