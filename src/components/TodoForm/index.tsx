import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Todo } from '../../types/todo';
import { styles } from './styles';

interface TodoFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  editingTodo?: Todo;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  visible,
  onClose,
  onSubmit,
  editingTodo,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
    } else {
      setTitle('');
    }
  }, [editingTodo]);

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title.trim());
      onClose();
      setTitle('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingTodo ? 'Edit Task' : 'Add New Task'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Task title"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {editingTodo ? 'Save' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}; 