import React, { useEffect, useState } from 'react';
import { View, Button, FlatList, StyleSheet, Text } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import TaskItem from '../components/TaskItem';
import { getAuth } from 'firebase/auth';

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);

    const fetchTasks = async () => {
      await getTasks(); // Função para buscar tarefas
      await getCompletedTasks(); // Função para buscar tarefas concluídas
    };

    fetchTasks();
  }, []);

  // Função para buscar tarefas ativas
  const getTasks = async () => {
    const auth = getAuth();
    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    const tasksList = tasksSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
      }))
      .filter(task => task.userId === auth.currentUser.uid); // Filtra pelas tarefas do usuário atual
    setTasks(tasksList);
  };

  // Função para buscar tarefas concluídas
  const getCompletedTasks = async () => {
    const auth = getAuth();
    const completedSnapshot = await getDocs(collection(db, 'completedTasks'));
    const completedList = completedSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
      }))
      .filter(task => task.userId === auth.currentUser.uid); // Filtra pelas tarefas do usuário atual
    setCompletedTasks(completedList);
  };

  const handleRefresh = async () => {
    await getTasks(); // Atualiza a lista de tarefas ativas
    await getCompletedTasks(); // Atualiza a lista de tarefas concluídas
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleComplete = async (task) => {
    const completedTaskData = {
      completed: true,
      description: task.description,
      createdAt: task.createdAt,
      dueDate: task.dueDate,
      userId: task.userId, // Adiciona o ID do usuário
    };

    try {
      await setDoc(doc(db, 'completedTasks', task.id), completedTaskData);
      await deleteDoc(doc(db, 'tasks', task.id));
      setTasks(tasks.filter(t => t.id !== task.id));
      await getCompletedTasks();
    } catch (error) {
      console.error("Erro ao completar a tarefa:", error);
    }
  };

  const handleDeleteCompletedTask = async (id) => {
    await deleteDoc(doc(db, 'completedTasks', id));
    setCompletedTasks(completedTasks.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      {user && <Text style={styles.userText}>Welcome, {user.email}!</Text>}
      <View style={styles.buttonContainer}>
        <Button title="Update Tasks" onPress={handleRefresh} color="#4CAF50" />
        <View style={styles.space} />
        <Button title="Add Task" onPress={() => navigation.navigate('AddTask')} color="#2196F3" />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
            onEdit={() => navigation.navigate('EditTask', { task: item })}
          />
        )}
      />
      <Text style={styles.completedTasksTitle}>Completed Tasks</Text>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onDelete={handleDeleteCompletedTask}
            onToggleComplete={() => {}}
            onEdit={() => {}}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  userText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  space: {
    width: 10,
  },
  completedTasksTitle: {
    fontSize: 24,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TaskListScreen;