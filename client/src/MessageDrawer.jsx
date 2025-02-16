import React from 'react';
import { Drawer } from '@mui/material';

function MessageDrawer({ open, onClose }) {
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
                <h2>Messages</h2>
                {/* Add your message content here */}
            </div>
        </Drawer>
    );
}

export default MessageDrawer;