import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AboutUsScreen = () => {
  const navigation = useNavigation();

  const developers = [
    { id: '1', name: 'Kathlyn M. Leal', role: 'Project Manager', image: require('../assets/Profile/Leal.jpg') },
    { id: '2', name: 'John Lloyd L. Nadura', role: 'UI/UX Designer', image: require('../assets/Profile/Nadz.jpg') },
    { id: '3', name: 'John Steven M. Solsona', role: 'Frontend Developer', image: require('../assets/Profile/Steven.jpg') },
    { id: '4', name: 'Ralph F. Gagante', role: 'Backend Developer', image: require('../assets/Profile/Ralph.jpg') },
    { id: '5', name: 'Elton John C. Polizon', role: 'Assurance Security', image: require('../assets/Profile/Elton.jpg') },
    { id: '6', name: 'Kristian D. Avenido', role: 'Database Administrator', image: require('../assets/Profile/kris.jpg') },
    { id: '7', name: 'Tracy Jasmine Cascayan', role: 'User Insights', image: require('../assets/Profile/Tracy.jpg') },
    { id: '8', name: 'Developers', role: 'Release Manager', image: require('../assets/Profile/cube.jpg') },
  ];

  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={() => (
        <>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>About Us</Text>
          </View>

          {/* Description Section */}
          <Text style={styles.description}>
            We are a group of seven passionate developers collaborating to bring this application to life. 
            Each member has contributed their unique expertise to make this app a success.
          </Text>
        </>
      )}
      data={developers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          {/* Developer Profile Image */}
          <Image source={item.image} style={styles.icon} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        </Animated.View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  headerText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 15,
    letterSpacing: 1.5,
  },
  description: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 30,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    marginRight: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  role: {
    fontSize: 16,
    color: '#bbb',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
});

export default AboutUsScreen;
