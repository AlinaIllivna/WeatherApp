import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherByCity, toggleFavorite } from '../store/weatherSlice';
import { Ionicons } from '@expo/vector-icons';
import { API_KEY } from '../../config';

export default function HomeScreen({ navigation }) {
  const [cityName, setCityName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch();

  const { searchResult, favorites, loading, error, tempUnit } = useSelector(
    (state) => state.weather
  );

  useEffect(() => {
    if (!searchResult) {
      dispatch(fetchWeatherByCity('Kyiv'));
    }
  }, []);

  const fetchCitySuggestions = async (text) => {
    setCityName(text);
    if (text.trim().length > 2) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCity = (name) => {
    setCityName(name);
    setSuggestions([]);
    dispatch(fetchWeatherByCity(name));
  };

  const handleSearch = () => {
    if (cityName.trim()) {
      setSuggestions([]);
      dispatch(fetchWeatherByCity(cityName.trim()));
    }
  };

  const clearSearch = () => {
    setCityName('');
    setSuggestions([]);
  };

  const convertTemp = (tempInC) => {
    if (tempUnit === 'F') return Math.round((tempInC * 9) / 5 + 32) + '°F';
    return Math.round(tempInC) + '°C';
  };

  const currentData = searchResult?.current;
  const isFavorite = favorites.some((item) => item.id === currentData?.id);
  const currentTempC = currentData?.main?.temp;
  
  let themeStyles = {
    bg: '#F1F5F9',
    textColor: '#334155',
    cardBg: '#64748B',
    cardText: '#FFFFFF',
    statusEmoji: '🌤️',
  };

  if (currentTempC !== undefined) {
    if (currentTempC >= 15) {
      themeStyles = {
        bg: '#FFF7ED',
        textColor: '#1E293B',
        cardBg: '#F59E0B',
        cardText: '#FFFFFF',
        statusEmoji: '☀️',
      };
    } else {
      themeStyles = {
        bg: '#0F172A',
        textColor: '#F8FAFC',
        cardBg: '#1E293B',
        cardText: '#FFFFFF',
        statusEmoji: '❄️',
      };
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles.bg }]}>
      <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>
        Weather Search {themeStyles.statusEmoji}
      </Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter city (e.g. London)..."
            placeholderTextColor="#94A3B8"
            value={cityName}
            onChangeText={fetchCitySuggestions}
            onSubmitEditing={handleSearch}
          />
          {cityName.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Ionicons name="search" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {suggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSelectCity(item.name)}
              >
                <Text style={styles.suggestionText}>
                  📍 {item.name}{item.state ? `, ${item.state}` : ''} ({item.country})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {loading && <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 30 }} />}

      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      {currentData && !loading && (
        <View style={[styles.weatherCard, { backgroundColor: themeStyles.cardBg }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cityName, { color: themeStyles.cardText }]}>
                {currentData.name}, {currentData.sys?.country}
              </Text>
              <Text style={styles.dateText}>
                Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <TouchableOpacity onPress={() => dispatch(toggleFavorite(currentData))}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={30}
                color={isFavorite ? '#EF4444' : '#FFF'}
              />
            </TouchableOpacity>
          </View>

          <Image
            style={styles.weatherIcon}
            source={{
              uri: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@4x.png`,
            }}
          />

          <Text style={[styles.temp, { color: themeStyles.cardText }]}>
            {convertTemp(currentData.main?.temp)}
          </Text>
          <Text style={styles.description}>{currentData.weather[0]?.description}</Text>

          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() => navigation.navigate('Details', { searchData: searchResult })}
          >
            <Text style={styles.detailsBtnText}>5-Day Forecast & Details →</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  searchContainer: { zIndex: 10, marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, elevation: 3 },
  input: { flex: 1, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#0F172A' },
  clearBtn: { padding: 8 },
  searchBtn: { backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderTopRightRadius: 14, borderBottomRightRadius: 14 },
  suggestionsBox: { backgroundColor: '#FFF', borderRadius: 12, marginTop: 5, elevation: 5, paddingVertical: 5 },
  suggestionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  suggestionText: { fontSize: 15, color: '#334155' },
  errorText: { color: '#EF4444', textAlign: 'center', marginTop: 15, fontSize: 16 },
  weatherCard: { borderRadius: 24, padding: 24, alignItems: 'center', elevation: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' },
  cityName: { fontSize: 22, fontWeight: 'bold' },
  dateText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', marginTop: 2 },
  weatherIcon: { width: 120, height: 120 },
  temp: { fontSize: 52, fontWeight: 'bold' },
  description: { fontSize: 18, color: 'rgba(255, 255, 255, 0.9)', textTransform: 'capitalize', marginBottom: 20 },
  detailsBtn: { backgroundColor: 'rgba(255, 255, 255, 0.25)', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  detailsBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});