const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

const apiKey = '95a8848c04342d479ed59b415049e16a';

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).send('City name is required');
  }

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;
    res.json({
      city: weatherData.name,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
    });
  } catch (error) {
    res.status(500).send('Error fetching the weather data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
