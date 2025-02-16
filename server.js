const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/stockdb', { useNewUrlParser: true, useUnifiedTopology: true });

const StockSchema = new mongoose.Schema({
    symbol: String,
    price: String,
    high: String,
    low: String,
    volume: String
});

const Stock = mongoose.model('Stock', StockSchema);

app.use(express.json());

app.get('/api/stocks/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const apiKey = 'YOUR_API_KEY';
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        const stockData = response.data['Time Series (5min)'];
        const latestTime = Object.keys(stockData)[0];
        const latestData = stockData[latestTime];

        const stock = new Stock({
            symbol,
            price: latestData['1. open'],
            high: latestData['2. high'],
            low: latestData['3. low'],
            volume: latestData['5. volume']
        });

        await stock.save();
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock data' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));