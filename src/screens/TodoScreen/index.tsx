import React, {useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TodoForm} from '../../components/TodoForm';
import {TodoList} from '../../components/TodoList';
import {useTodos} from '../../hooks/useTodos';
import {Todo} from '../../types/todo';
import {styles} from './styles';

export const TodoScreen: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>(
    'pending',
  );

  const {
    todos,
    loading,
    isSyncing,
    isOffline,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos();

  const filteredTodos = todos.filter(todo =>
    activeTab === 'completed' ? todo.completed : !todo.completed,
  );

  const pendingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  const handleAddTodo = (title: string) => {
    addTodo(title);
    setIsFormVisible(false);
  };

  const handleEditTodo = (title: string) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, {title});
      setEditingTodo(undefined);
      setIsFormVisible(false);
    }
  };

  const handleOpenEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todo List</Text>
        {isOffline && <Text style={styles.offlineIndicator}>Offline Mode</Text>}
        {isSyncing && <Text style={styles.syncingIndicator}>Syncing...</Text>}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'pending' && styles.activeTabText,
            ]}>
            Pending ({pendingCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'completed' && styles.activeTabText,
            ]}>
            Completed ({completedCount})
          </Text>
        </TouchableOpacity>
      </View>

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onEdit={handleOpenEdit}
        onDelete={deleteTodo}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsFormVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <TodoForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setEditingTodo(undefined);
        }}
        onSubmit={editingTodo ? handleEditTodo : handleAddTodo}
        editingTodo={editingTodo}
      />
    </SafeAreaView>
  );
};
