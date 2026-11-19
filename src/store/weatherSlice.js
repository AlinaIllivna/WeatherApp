import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_KEY, BASE_URL } from '../../config';

export const fetchWeatherByCity = createAsyncThunk(
  'weather/fetchByCity',
  async (cityName, { rejectWithValue }) => {
    try {
      const resCurrent = await fetch(
        `${BASE_URL}/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      const dataCurrent = await resCurrent.json();
      if (!resCurrent.ok) throw new Error(dataCurrent.message || 'City not found');

      const resForecast = await fetch(
        `${BASE_URL}/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      const dataForecast = await resForecast.json();

      return {
        current: dataCurrent,
        forecast: dataForecast.list || [],
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    searchResult: null,
    favorites: [],
    loading: false,
    error: null,
    tempUnit: 'C',
    themeMode: 'auto', // 'auto', 'light', 'dark'
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const city = action.payload;
      const index = state.favorites.findIndex((item) => item.id === city.id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(city);
      }
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
    toggleUnit: (state) => {
      state.tempUnit = state.tempUnit === 'C' ? 'F' : 'C';
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = action.payload;
      })
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleFavorite, clearFavorites, toggleUnit, setThemeMode } = weatherSlice.actions;
export default weatherSlice.reducer;