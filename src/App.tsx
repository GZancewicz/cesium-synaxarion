import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CesiumViewer from './components/CesiumViewer';
import { HistoricalFigure, Connection } from './types';

// Sample data - replace with actual data source
const sampleFigures: HistoricalFigure[] = [
  {
    id: '1',
    name: 'Holy Martyr Codratus of Corinth',
    type: 'saint',
    deathYear: 251,
    location: {
      latitude: 37.9387,
      longitude: 22.9322, // Corinth, Greece
    },
  },
  {
    id: '2',
    name: 'Emperor Decius',
    type: 'emperor',
    birthYear: 200,
    deathYear: 251,
    location: {
      latitude: 41.9028,
      longitude: 12.4964, // Rome, Italy
    },
  },
  {
    id: '3',
    name: 'Holy Martyr Codratus of Nicomedia',
    type: 'saint',
    deathYear: 258, // Estimated during Valerian's reign
    location: {
      latitude: 40.7731,
      longitude: 29.9178, // Nicomedia (modern-day İzmit, Turkey)
    },
  },
  {
    id: '4',
    name: 'Venerable Mother Anastasia of Alexandria',
    type: 'saint',
    deathYear: 567,
    location: {
      latitude: 31.2001,
      longitude: 29.9187, // Alexandria, Egypt
    },
  }
];

const sampleConnections: Connection[] = [
  {
    id: '1',
    fromId: '1', // Codratus (id: '1')
    toId: '2',   // Decius (id: '2')
    type: 'lived_under',
    bidirectional: false,
  }
];

const DRAWER_WIDTH = 300;

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);

  const handleFigureClick = (figure: HistoricalFigure) => {
    setSelectedFigure(figure);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <AppBar position="fixed">
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

      <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px' }}>
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              position: 'relative',
              height: '100%',
            },
          }}
        >
          <List>
            {sampleFigures.map((figure) => (
              <ListItemButton
                key={figure.id}
                selected={selectedFigure?.id === figure.id}
                onClick={() => {
                  setSelectedFigure(figure);
                }}
              >
                <ListItemText
                  primary={figure.name}
                  secondary={`${figure.type} (${figure.birthYear || '?'} - ${figure.deathYear || '?'})`}
                />
              </ListItemButton>
            ))}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <CesiumViewer
            figures={sampleFigures}
            connections={sampleConnections}
            onFigureClick={handleFigureClick}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default App; 