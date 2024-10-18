import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from 'firebase/auth';

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const auth = getAuth();

  const handleEditTask = async () => {
    if (!description) {
      Alert.alert('Please enter a task description.');
      return;
    }

    await updateDoc(doc(db, 'tasks', task.id), {
      description,
      dueDate, // Atualizando a data de vencimento
      userId: auth.currentUser.uid, // Garantindo que o ID do usuário esteja presente
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
        <Button title="Save Changes" onPress={handleEditTask} color="#4CAF50" />
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

export default EditTaskScreen;