import React from 'react';
import {
  View,
  FlatList,
  Text,
} from 'react-native';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/todo';
import { styles } from './styles';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onEdit,
  onDelete
}) => {
  if (todos.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No tasks found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          onToggle={() => onToggle(item.id)}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
}; 