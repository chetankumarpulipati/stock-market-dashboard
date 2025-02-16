import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse, TextField } from '@mui/material';
import { ExpandLess, ExpandMore, Dashboard as DashboardIcon } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import TableViewIcon from '@mui/icons-material/TableView';
import PageviewIcon from '@mui/icons-material/Pageview';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import './StockDashboard.css';
import InputAdornment from '@mui/material/InputAdornment';
import NotificationDrawer from './NotificationDrawer';
import MessageDrawer from './MessageDrawer';
import StockOverview from './StockOverview';
import axios from 'axios';

function StockDashboard() {
    const [openItems, setOpenItems] = useState({});
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [stockData, setStockData] = useState([]);
    const [investedValue, setInvestedValue] = useState(0);
    const [totalReturns, setTotalReturns] = useState(0);

    const handleClick = (item) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [item]: !prevOpenItems[item],
        }));
    };

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            console.log(companyName); // Print the text in the search box
            try {
                const response = await axios.get(`http://localhost:5000/api/stocks/${companyName}`);
                setStockData(response.data);
                // Assuming the backend response contains investedValue and totalReturns
                setInvestedValue(response.data.investedValue);
                setTotalReturns(response.data.totalReturns);
            } catch (error) {
                console.error('Error fetching stock data', error);
            }
        }
    };

    const toggleRightDrawer = (open, type = '') => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setRightDrawerOpen(open);
        setDrawerType(type);
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

    return (
        <div className="stock-dashboard">
            <div>
                <Drawer
                    variant="permanent"
                    anchor="left"
                    sx={{
                        '& .MuiDrawer-paper': {
                            backgroundColor: 'black',
                            color: 'white',
                            width: 240,
                        },
                    }}
                >
                    <List>
                        {menuItems.map((item, index) => (
                            typeof item === 'string' ? (
                                <ListItem key={index} className="admin-heading">
                                    <ListItemText primary={item}/>
                                </ListItem>
                            ) : (
                                <div key={index}>
                                    <ListItem button onClick={() => handleClick(item.text)}>
                                        <ListItemIcon className="cursor-pointer" sx={{color: 'white'}}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text}/>
                                        {item.submenu && (openItems[item.text] ? <ExpandLess/> : <ExpandMore/>)}
                                    </ListItem>
                                    {item.submenu && (
                                        <Collapse in={openItems[item.text]} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {item.submenu.map((subItem, subIndex) => (
                                                    <ListItem button key={subIndex} sx={{pl: 4}} className="cursor-pointer">
                                                        <ListItemText primary={subItem}/>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Collapse>
                                    )}
                                </div>
                            )
                        ))}
                    </List>
                </Drawer>
                <main className="content" style={{display: 'flex', alignItems: 'center'}}>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        sx={{
                            width: '100%',
                            maxWidth: '850px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderWidth: '2px',
                                },
                            },
                            '@media (max-width: 600px)': {
                                width: '100%',
                            },
                        }}
                        placeholder="Search"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 'auto',
                        marginRight: '10px',
                        cursor: 'pointer'
                    }}>
                        <NotificationsIcon onClick={toggleRightDrawer(true, 'notifications')} sx={{fontSize: '35px'}}
                                           style={{padding: '10px'}}/>
                        <MessageRoundedIcon onClick={toggleRightDrawer(true, 'messages')} sx={{fontSize: '35px'}}/>
                    </div>
                    <div style={{
                        justifyContent: "center",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: 'center',
                        padding: '5px'
                    }}>
                        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '5px', marginRight: '5px'}}>
                            <span style={{fontWeight: 'bold'}}>John Doe</span>
                            <span style={{fontSize: '9px'}}>Software Engineer</span>
                        </div>
                        <PersonIcon style={{borderStyle: 'solid', borderWidth: '2px', borderRadius: '50px'}}
                                    sx={{fontSize: '28px'}}/>
                    </div>
                    {drawerType === 'notifications' &&
                        <NotificationDrawer open={rightDrawerOpen} onClose={toggleRightDrawer(false)}/>}
                    {drawerType === 'messages' &&
                        <MessageDrawer open={rightDrawerOpen} onClose={toggleRightDrawer(false)}/>}
                </main>
            </div>
            {/*<StockOverview stockData={stockData} investedValue={investedValue} totalReturns={totalReturns} />*/}
        </div>
    );
}

export default StockDashboard;