import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const TaskItem = ({ task, onDelete, onToggleComplete, onEdit }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onToggleComplete(task)}>
        <Text style={[styles.taskText, task.completed && styles.completed]}>
          {task.description}
        </Text>
        {task.dueDate && (
          <Text style={styles.dateText}>
            Due: {task.dueDate.toLocaleDateString()}
          </Text>
        )}
      </TouchableOpacity>
      <View style={styles.buttons}>
        {/* O botão de edição só aparece se a tarefa não estiver concluída */}
        {!task.completed && (
          <Button title="Edit" onPress={onEdit} color="#FFC107" />
        )}
        <Button title="Delete" onPress={() => onDelete(task.id)} color="#F44336" />
        {/* O botão de concluir só aparece se a tarefa não estiver concluída */}
        {!task.completed && (
          <Button title="Complete" onPress={() => onToggleComplete(task)} color="#4CAF50" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  taskText: {
    fontSize: 18,
    color: '#333',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default TaskItem;