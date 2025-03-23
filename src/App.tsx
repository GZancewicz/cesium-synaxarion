import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CesiumViewer from './components/CesiumViewer';
import { HistoricalFigure, Connection } from './types/historical-figures';
import historicalData from './data/historical-figures.json';

interface HistoricalData {
  figures: HistoricalFigure[];
  connections: Connection[];
}

const typedHistoricalData = historicalData as HistoricalData;

const DRAWER_WIDTH = 300;

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleFigureClick = (figure: HistoricalFigure) => {
    setSelectedFigure(figure);
  };

  const formatDates = (figure: HistoricalFigure): string => {
    const birth = figure.dates.birth;
    const death = figure.dates.death;
    
    if (birth && death) {
      const birthText = birth.isApproximate ? `ca. ${birth.year}` : birth.year;
      const deathText = death.isApproximate ? `ca. ${death.year}` : death.year;
      return `${birthText} - ${deathText}`;
    }
    if (birth) {
      return `b. ${birth.isApproximate ? 'ca. ' : ''}${birth.year}`;
    }
    if (death) {
      return `d. ${death.isApproximate ? 'ca. ' : ''}${death.year}`;
    }
    return '';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)`,
          marginLeft: drawerOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Orthodox Saints and Historical Figures
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <Toolbar /> {/* Add space for AppBar */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {typedHistoricalData.figures.map((figure) => (
              <ListItem 
                key={figure.id}
                button
                selected={selectedFigure?.id === figure.id}
                onClick={() => handleFigureClick(figure)}
              >
                <ListItemText
                  primary={figure.name}
                  secondary={formatDates(figure)}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: figure.type === 'saint' ? '#ffd700' : 'inherit',
                      fontWeight: figure.type === 'saint' ? 'bold' : 'normal'
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)`,
          marginLeft: drawerOpen ? 0 : `-${DRAWER_WIDTH}px`,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          height: '100vh',
          position: 'relative'
        }}
      >
        <Toolbar /> {/* Add space for AppBar */}
        <CesiumViewer 
          figures={typedHistoricalData.figures} 
          connections={typedHistoricalData.connections}
          onFigureClick={handleFigureClick} 
        />
      </Box>
    </Box>
  );
}

export default App; 