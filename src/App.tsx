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
      longitude: 28.9784, // Constantinople (modern-day Istanbul)
    },
  },
  {
    id: '2',
    name: 'Saint Basil the Great',
    type: 'saint',
    birthYear: 330,
    deathYear: 379,
    location: {
      latitude: 38.7223,
      longitude: 35.4873, // Caesarea Mazaca (modern-day Kayseri)
    },
  }
];

const sampleConnections: Connection[] = [
  {
    id: '1',
    fromId: '1',
    toId: '2',
    type: 'guided_by',
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