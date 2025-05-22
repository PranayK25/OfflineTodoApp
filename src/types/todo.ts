export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  synced: boolean;
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  isSyncing: boolean;
}

export interface AddTodoPayload {
  title: string;
  userId: number;
}

export interface UpdateTodoPayload {
  id: number;
  changes: Partial<Todo>;
} 