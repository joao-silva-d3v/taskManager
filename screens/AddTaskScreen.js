import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTaskScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const auth = getAuth(); // Obtenha a instância de autenticação

  const handleAddTask = async () => {
    if (!description) {
      Alert.alert('Please enter a task description.');
      return;
    }

    await addDoc(collection(db, 'tasks'), {
      description,
      completed: false,
      dueDate: dueDate,
      createdAt: serverTimestamp(),
      userId: auth.currentUser.uid, // Adiciona o ID do usuário
    });

    navigation.navigate('TaskList');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Description"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.buttonContainer}>
      <Button title="Select Due Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || dueDate;
            setShowDatePicker(false);
            setDueDate(currentDate);
          }}
        />
      )}
      <View style={styles.buttonContainer}>
      </View>
      <Button title="Add Task" onPress={handleAddTask} color="#4CAF50" />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
});

export default AddTaskScreen;