import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleUnit, clearFavorites, setThemeMode } from '../store/weatherSlice';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { tempUnit, themeMode, favorites } = useSelector((state) => state.weather);

  const isFahrenheit = tempUnit === 'F';

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to remove all saved cities?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => dispatch(clearFavorites()) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Temperature Unit */}
      <View style={styles.settingCard}>
        <View style={styles.row}>
          <View style={styles.labelGroup}>
            <Ionicons name="thermometer-outline" size={22} color="#3B82F6" />
            <Text style={styles.label}>Temperature Unit</Text>
          </View>
          <View style={styles.unitToggle}>
            <Text style={styles.unitText}>{isFahrenheit ? '°F' : '°C'}</Text>
            <Switch
              value={isFahrenheit}
              onValueChange={() => dispatch(toggleUnit())}
            />
          </View>
        </View>
      </View>

      {/* App Theme Selector */}
      <View style={styles.settingCard}>
        <View style={styles.labelGroup}>
          <Ionicons name="color-palette-outline" size={22} color="#3B82F6" />
          <Text style={styles.label}>App Theme Mode</Text>
        </View>
        <View style={styles.themeOptions}>
          {['auto', 'light', 'dark'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.themeBtn,
                themeMode === mode && styles.themeBtnActive,
              ]}
              onPress={() => dispatch(setThemeMode(mode))}
            >
              <Text
                style={[
                  styles.themeBtnText,
                  themeMode === mode && styles.themeBtnTextActive,
                ]}
              >
                {mode.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Clear Favorites Button */}
      <TouchableOpacity
        style={[styles.dangerCard, favorites.length === 0 && { opacity: 0.5 }]}
        onPress={handleClearFavorites}
        disabled={favorites.length === 0}
      >
        <Ionicons name="trash-bin-outline" size={22} color="#EF4444" />
        <Text style={styles.dangerText}>Clear All Favorites ({favorites.length})</Text>
      </TouchableOpacity>

      {/* App Version Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>WeatherApp v1.0.0</Text>
        <Text style={styles.footerSubText}>Powered by OpenWeatherMap API</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginBottom: 20 },
  settingCard: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelGroup: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginLeft: 10 },
  unitToggle: { flexDirection: 'row', alignItems: 'center' },
  unitText: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6', marginRight: 8 },
  themeOptions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  themeBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  themeBtnActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  themeBtnText: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  themeBtnTextActive: { color: '#FFF' },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  dangerText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#94A3B8', fontWeight: '500' },
  footerSubText: { fontSize: 12, color: '#CBD5E1', marginTop: 2 },
});