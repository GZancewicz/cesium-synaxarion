import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CesiumViewer from './components/CesiumViewer';
import { HistoricalFigure, Connection } from './types';
import historicalData from './data/historical-figures.json';

interface HistoricalData {
  figures: HistoricalFigure[];
  connections: Connection[];
}

const typedHistoricalData = historicalData as HistoricalData;

const DRAWER_WIDTH = 300;

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);

  const handleFigureClick = (figure: HistoricalFigure) => {
    setSelectedFigure(figure);
    setIsDrawerOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="relative">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Orthodox Saints and Historical Figures
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <CesiumViewer 
          figures={typedHistoricalData.figures} 
          connections={typedHistoricalData.connections}
          onFigureClick={handleFigureClick} 
        />
      </Box>

      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {selectedFigure && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6">{selectedFigure.name}</Typography>
            {selectedFigure.birthYear && (
              <Typography>Birth: {selectedFigure.birthYear}</Typography>
            )}
            {selectedFigure.deathYear && (
              <Typography>Death: {selectedFigure.deathYear}</Typography>
            )}
            <Typography>Type: {selectedFigure.type}</Typography>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

export default App; 