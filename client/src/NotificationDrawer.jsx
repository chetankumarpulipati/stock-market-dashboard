import React from 'react';
import { Drawer } from '@mui/material';

function NotificationDrawer({ open, onClose }) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 300,
                },
            }}
        >
            <div style={{ padding: '16px' }}>
                <h2>Notifications</h2>
                {/* Add your notification content here */}
            </div>
        </Drawer>
    );
}

export default NotificationDrawer;