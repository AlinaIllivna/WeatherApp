import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite, fetchWeatherByCity } from '../store/weatherSlice';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { favorites, tempUnit, loading } = useSelector((state) => state.weather);

  const convertTemp = (tempInC) => {
    if (tempUnit === 'F') return Math.round((tempInC * 9) / 5 + 32) + '°F';
    return Math.round(tempInC) + '°C';
  };

  const handleOpenDetails = async (cityName) => {
    const actionResult = await dispatch(fetchWeatherByCity(cityName));
    if (fetchWeatherByCity.fulfilled.match(actionResult)) {
      navigation.navigate('Details', { searchData: actionResult.payload });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleOpenDetails(item.name)}>
      <View style={styles.cardLeft}>
        {item.weather?.[0]?.icon && (
          <Image
            style={styles.icon}
            source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png` }}
          />
        )}
        <View>
          <Text style={styles.cityName}>{item.name}, {item.sys?.country}</Text>
          <Text style={styles.weatherDesc}>{item.weather?.[0]?.description}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.temp}>{convertTemp(item.main?.temp)}</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => dispatch(toggleFavorite(item))}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Favorite Cities ♥</Text>
      {loading && <ActivityIndicator size="small" color="#3B82F6" style={{ marginBottom: 10 }} />}
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={60} color="#94A3B8" />
          <Text style={styles.emptyText}>No favorite cities added yet.</Text>
          <Text style={styles.emptySubText}>Search for a city and tap the heart icon!</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginBottom: 20, textAlign: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { marginTop: 15, fontSize: 18, fontWeight: '600', color: '#475569' },
  emptySubText: { marginTop: 5, fontSize: 14, color: '#94A3B8' },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { width: 45, height: 45, marginRight: 10 },
  cityName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  weatherDesc: { fontSize: 13, color: '#64748B', textTransform: 'capitalize', marginTop: 2 },
  cardRight: { flexDirection: 'row', alignItems: 'center' },
  temp: { fontSize: 20, color: '#3B82F6', fontWeight: 'bold', marginRight: 15 },
  deleteBtn: { padding: 6, backgroundColor: '#FEE2E2', borderRadius: 10 },
});