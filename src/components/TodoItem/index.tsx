import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Todo } from '../../types/todo';
import { styles } from './styles';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={onToggle}
      >
        <View style={[
          styles.checkboxInner,
          todo.completed && styles.checkboxChecked
        ]} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={[
          styles.title,
          todo.completed && styles.completedText
        ]}>
          {todo.title}
        </Text>
        {!todo.synced && (
          <Text style={styles.syncStatus}>Not synced</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}; 