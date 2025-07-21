import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  capitalize,
} from "@mui/material";

const API_KEY = "b04d419ea968b89c22d0595db2a24be2";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch weather data for the given city
  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) {
        throw new Error("City not found");
      }
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setCity("");
    }

    // Update recent searches and save to localStorage
    setRecentSearches((prev) => {
      let updated = [city, ...prev.filter((c) => c.toLowerCase() !== city.toLowerCase())];

      if (updated.length > 5) {
        updated = updated.slice(0, 5);
      }

      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });

  };
  
  
  // Clear weather data and recent searches
  const clearWeather = () => {
    setWeather(null);
    setCity("");
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        🌤 Weather App
      </Typography>

      <Container sx={{ gap: 2, display: "flex", flexDirection: "row", height: "55px" }}>
        <TextField
          label="Enter city"
          variant="outlined"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={getWeather}>
          Get Weather
        </Button>
        <Button variant="" fullWidth onClick={clearWeather}>
          Clear
        </Button>
      </Container>

      {recentSearches.length > 0 && (
        <Card sx={{ mt: 4, p: 2 }}>
          <Typography variant="subtitle1">Recent Searches:</Typography>
          {recentSearches.map((item, index) => (
            <Button
              key={index}
              onClick={() => setCity(item)}
              size="small"
              variant="text"
              sx={{ m: 0.5 }}
            >
              {item}
            </Button>
          ))}
        </Card>
      )}

      {loading && <CircularProgress sx={{ mt: 3 }} />}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {weather && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h5">{weather.name}</Typography>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <Typography variant="h6">{weather.main.temp}°C</Typography>
            <Typography color="text.secondary">
              {capitalize(weather.weather[0].description)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Humidity: {weather.main.humidity}%
            </Typography>
            <Typography variant="body2">
              Wind: {weather.wind.speed} m/s
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Local Time: {new Date(weather.dt * 1000).toLocaleTimeString()}
            </Typography>

          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default App;
