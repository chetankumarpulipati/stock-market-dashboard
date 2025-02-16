import React, { useState } from 'react';
import {
    Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse, TextField, InputAdornment, CircularProgress
} from '@mui/material';
import { ExpandLess, ExpandMore, Dashboard as DashboardIcon } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import TableViewIcon from '@mui/icons-material/TableView';
import PageviewIcon from '@mui/icons-material/Pageview';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import './StockDashboard.css';

function StockDashboard() {
    const [openItems, setOpenItems] = useState({});
    const [companyName, setCompanyName] = useState('');
    const [date, setDate] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleClick = (item) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [item]: !prevOpenItems[item],
        }));
    };

    const fetchStockData = async () => {
        if (!companyName.trim()) return;
        setLoading(true);
        console.log(`Fetching data for: ${companyName}`);

        try {
            const response = await axios.get(
                `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${companyName}&apikey=5ZV1VR12IRRDCYSW`
            );

            console.log("API Response:", response.data);

            if (!response.data || response.data["Error Message"]) {
                setData({ error: 'Invalid API Response. Please check the company symbol.' });
            } else if (!response.data["Meta Data"] || !response.data["Time Series (Daily)"]) {
                setData({ error: 'API returned unexpected data. Try again later.' });
            } else {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
            setData({ error: 'Network error or API limit exceeded. Try again later.' });
        } finally {
            setLoading(false);
        }
    };


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchStockData();
        }
    };

    const menuItems = [
        'Admin',
        { text: 'Dashboard', icon: <DashboardIcon />, submenu: ['Ecommerce', 'CRM', 'Marketing', 'Analytics', 'Stocks'] },
        { text: 'Calendar', icon: <CalendarMonthIcon /> },
        { text: 'Person', icon: <PersonIcon /> },
        { text: 'Tasks', icon: <FormatListBulletedIcon />, submenu: ['temp'] },
        { text: 'Forms', icon: <FormatAlignJustifyIcon />, submenu: ['temp'] },
        { text: 'Tables', icon: <TableViewIcon />, submenu: ['temp'] },
        { text: 'Pages', icon: <PageviewIcon />, submenu: ['temp'] }
    ];

    const renderStockData = () => {
        if (loading) return <div className="loading"><CircularProgress /></div>;
        if (!data) return <div className="no-data">No Data Found</div>;
        if (data.error) return <div className="error">{data.error}</div>;

        const metaData = data["Meta Data"];
        const stockData = data["Time Series (Daily)"];
        const symbol = metaData["2. Symbol"] || "Unknown Symbol";

        if (date) {
            if (!stockData[date]) {
                return <div className="error">No data available for {date}</div>;
            }
            const stockDetails = stockData[date];
            return (
                <div className="stock-item">
                    <h2>Symbol: {symbol}</h2>
                    <h3>Date: {date}</h3>
                    <p>Open: {stockDetails["1. open"]}</p>
                    <p>High: {stockDetails["2. high"]}</p>
                    <p>Low: {stockDetails["3. low"]}</p>
                    <p>Close: {stockDetails["4. close"]}</p>
                    <p>Volume: {stockDetails["5. volume"]}</p>
                </div>
            );
        }

        return (
            <div>
                <h2>Symbol: {symbol}</h2>
                {Object.entries(stockData).map(([stockDate, item], index) => (
                    <div key={index} className="stock-item">
                        <h3>Date: {stockDate}</h3>
                        <p>Open: {item["1. open"]}</p>
                        <p>High: {item["2. high"]}</p>
                        <p>Low: {item["3. low"]}</p>
                        <p>Close: {item["4. close"]}</p>
                        <p>Volume: {item["5. volume"]}</p>
                        <hr />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="stock-dashboard">
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{ '& .MuiDrawer-paper': { backgroundColor: 'black', color: 'white', width: 240 } }}
            >
                <List>
                    {menuItems.map((item, index) =>
                        typeof item === 'string' ? (
                            <ListItem key={index} className="admin-heading">
                                <ListItemText primary={item} />
                            </ListItem>
                        ) : (
                            <div key={index}>
                                <ListItem onClick={() => handleClick(item.text)}>
                                    <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                    {item.submenu && (openItems[item.text] ? <ExpandLess /> : <ExpandMore />)}
                                </ListItem>
                                {item.submenu && (
                                    <Collapse in={openItems[item.text]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.submenu.map((subItem, subIndex) => (
                                                <ListItem key={subIndex} sx={{ pl: 4 }}>
                                                    <ListItemText primary={subItem} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </div>
                        )
                    )}
                </List>
            </Drawer>

            <main className="content">
                <TextField
                    variant="outlined"
                    sx={{ width: '100%', maxWidth: '500px' }}
                    placeholder="Enter Company Symbol (e.g., GOOG)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                />
                <TextField type="date" sx={{ marginLeft: "10px" }} value={date} onChange={(e) => setDate(e.target.value)} />
            </main>

            <div className="overview">{renderStockData()}</div>
        </div>
    );
}

export default StockDashboard;