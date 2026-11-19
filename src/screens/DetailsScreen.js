import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useSelector } from 'react-redux';

export default function DetailsScreen({ route }) {
  const { searchData } = route.params || {};
  const current = searchData?.current;
  const forecast = searchData?.forecast || [];
  const tempUnit = useSelector((state) => state.weather.tempUnit);

  const convertTemp = (tempInC) => {
    if (tempUnit === 'F') return Math.round((tempInC * 9) / 5 + 32) + '°F';
    return Math.round(tempInC) + '°C';
  };

  const dailyForecast = forecast.filter((item) => item.dt_txt.includes('12:00:00'));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{current?.name}, {current?.sys?.country}</Text>
      <Text style={styles.mainTemp}>{convertTemp(current?.main?.temp)}</Text>
      <Text style={styles.subText}>Feels like {convertTemp(current?.main?.feels_like)}</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Humidity</Text>
          <Text style={styles.statValue}>{current?.main?.humidity}%</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Wind</Text>
          <Text style={styles.statValue}>{current?.wind?.speed} m/s</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Pressure</Text>
          <Text style={styles.statValue}>{current?.main?.pressure} hPa</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyList}>
        {forecast.slice(0, 8).map((item, index) => (
          <View key={index} style={styles.hourlyCard}>
            <Text style={styles.hourlyTime}>{item.dt_txt.split(' ')[1].slice(0, 5)}</Text>
            <Image
              style={styles.smallIcon}
              source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png` }}
            />
            <Text style={styles.hourlyTemp}>{convertTemp(item.main.temp)}</Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>5-Day Forecast</Text>
      {dailyForecast.map((item, index) => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        return (
          <View key={index} style={styles.dailyRow}>
            <Text style={styles.dailyDate}>{date}</Text>
            <Image
              style={styles.smallIcon}
              source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png` }}
            />
            <Text style={styles.dailyTemp}>{convertTemp(item.main.temp)}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#0F172A' },
  mainTemp: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', color: '#3B82F6', marginTop: 5 },
  subText: { fontSize: 16, textAlign: 'center', color: '#64748B', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { backgroundColor: '#FFF', padding: 15, borderRadius: 16, width: '30%', alignItems: 'center', elevation: 2 },
  statLabel: { fontSize: 12, color: '#64748B', marginBottom: 5 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 12, marginTop: 10 },
  hourlyList: { flexDirection: 'row', marginBottom: 25 },
  hourlyCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 16, alignItems: 'center', marginRight: 10, minWidth: 70, elevation: 2 },
  hourlyTime: { fontSize: 12, color: '#64748B' },
  hourlyTemp: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  smallIcon: { width: 40, height: 40 },
  dailyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 16, marginBottom: 10, elevation: 1 },
  dailyDate: { fontSize: 15, color: '#334155', fontWeight: '500', width: 130 },
  dailyTemp: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
});