import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CesiumViewer from './components/CesiumViewer';
import { HistoricalFigure, Connection } from './types';

// Sample data - replace with actual data source
const sampleFigures: HistoricalFigure[] = [
  {
    id: '1',
    name: 'Saint John Chrysostom',
    type: 'saint',
    birthYear: 349,
    deathYear: 407,
    location: {
      latitude: 41.0082,
      longitude: 28.9784,
    },
  },
  // Add more sample figures here
];

const sampleConnections: Connection[] = [
  {
    id: '1',
    fromId: '1',
    toId: '2',
    type: 'guided_by',
    bidirectional: false,
  },
  // Add more sample connections here
];

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);

  const handleFigureClick = (figure: HistoricalFigure) => {
    setSelectedFigure(figure);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Cesium Synaxarion
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 300,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {sampleFigures.map((figure) => (
              <ListItemButton
                key={figure.id}
                selected={selectedFigure?.id === figure.id}
                onClick={() => {
                  setSelectedFigure(figure);
                  setDrawerOpen(true);
                }}
              >
                <ListItemText
                  primary={figure.name}
                  secondary={`${figure.type} (${figure.birthYear || '?'} - ${figure.deathYear || '?'})`}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Spacer for AppBar */}
        <CesiumViewer
          figures={sampleFigures}
          connections={sampleConnections}
          onFigureClick={handleFigureClick}
        />
      </Box>
    </Box>
  );
};

export default App; 