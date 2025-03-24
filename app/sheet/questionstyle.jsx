import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import myStory from '../datas';

const options = ['A', 'B', 'C', 'D']
const judgmentOptions = ['正确', '错误'];

export const OnePractice = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const renderOption = (option) => (
    <View key={option}>
      <TouchableOpacity 
        style={[
          styles.choose, 
          selectedOption === option && styles.selectedChoose
        ]}
        onPress={() => setSelectedOption(option)}
      >
        <View style={styles.optionContent}>
          <Text>{option}.</Text>
          <Text>{option}</Text>
        </View>                
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      {options.map(renderOption)}
    </View>
  );
};

export const MorePractice = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    setSelectedOptions(prevOptions => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter(item => item !== option);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  const renderOption = (option) => (
    <View key={option}>
      <TouchableOpacity 
        style={[
          styles.choose, 
          selectedOptions.includes(option) && styles.selectedChoose
        ]}
        onPress={() => toggleOption(option)}
      >
        <View style={styles.optionContent}>
          <Text>{option}.</Text>
          <Text>{'XXXXXXXXXXXXXX'}</Text>
        </View>                
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      {options.map(renderOption)}
    </View>
  );
};

export const JudgmentPractice = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const renderOption = (option) => (
    <View key={option}>
      <TouchableOpacity 
        style={[
          styles.choose, 
          selectedOption === option && styles.selectedChoose
        ]}
        onPress={() => setSelectedOption(option)}
      >
        <View style={styles.optionContent}>
          <Text>{option}</Text>
        </View>                
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      {judgmentOptions.map(renderOption)}
    </View>
  );
};

const styles = StyleSheet.create({
  choose: {
    marginTop: 30,
    marginLeft: '10%',
    width: '80%',
    height: 60,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  selectedChoose: {
    backgroundColor: '#3083FE',
  },
  optionContent: {
    marginTop: 15,
    marginLeft: 20,
    flexDirection: 'row',
  },
});