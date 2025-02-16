import React, { useState } from 'react';
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

function StockDashboard() {
    const [openItems, setOpenItems] = useState({});
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

    const handleClick = (item) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [item]: !prevOpenItems[item],
        }));
    };

    const toggleRightDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setRightDrawerOpen(open);
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
                                <ListItemText primary={item} />
                            </ListItem>
                        ) : (
                            <div key={index}>
                                <ListItem button onClick={() => handleClick(item.text)}>
                                    <ListItemIcon className="cursor-pointer" sx={{ color: 'white' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                    {item.submenu && (openItems[item.text] ? <ExpandLess /> : <ExpandMore />)}
                                </ListItem>
                                {item.submenu && (
                                    <Collapse in={openItems[item.text]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.submenu.map((subItem, subIndex) => (
                                                <ListItem button key={subIndex} sx={{ pl: 4 }} className="cursor-pointer">
                                                    <ListItemText primary={subItem} />
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
            <main className="content" style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    sx={{ width: '870px' }}
                    placeholder="Search"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: '10px', cursor: 'pointer' }}>
                    <NotificationsIcon onClick={toggleRightDrawer(true)} sx={{ fontSize: '35px' }} style={{ padding: '10px' }} />
                    <MessageRoundedIcon sx={{ fontSize: '35px' }} />
                </div>
                <div style={{ display: "flex", alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
                        <span>John Doe</span>
                        <span style={{ fontSize: '8px' }}>Software Engineer</span>
                    </div>
                    <PersonIcon sx={{ fontSize: '40px' }} />
                </div>
            </main>
            <NotificationDrawer open={rightDrawerOpen} onClose={toggleRightDrawer(false)} />
        </div>
    );
}

export default StockDashboard;