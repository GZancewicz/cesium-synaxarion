import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import CesiumViewer from './components/CesiumViewer';
import { Satellite } from './types/satellites';
import { getISSPosition } from './services/satellite';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  const [satellites, setSatellites] = useState<Satellite[]>([]);

  useEffect(() => {
    // Fetch ISS position once on mount
    const fetchISSPosition = async () => {
      try {
        const issPosition = await getISSPosition();
        const iss: Satellite = {
          id: 'iss',
          name: 'ISS',
          type: 'iss',
          location: {
            latitude: issPosition.latitude,
            longitude: issPosition.longitude,
            altitude: issPosition.altitude
          },
          info: `Altitude: ${(issPosition.altitude / 1000).toFixed(1)} km\nVelocity: ${Math.round(issPosition.velocity)} km/h\nLat: ${issPosition.latitude.toFixed(2)}°\nLon: ${issPosition.longitude.toFixed(2)}°`
        };
        setSatellites([iss]);
      } catch (error) {
        console.error('Failed to fetch ISS position:', error);
      }
    };

    fetchISSPosition();
  }, []);

  const handleSatelliteClick = (satellite: Satellite) => {
    console.log('Satellite clicked:', satellite);
    // TODO: Implement satellite selection behavior
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <CesiumViewer
          satellites={satellites}
          onSatelliteClick={handleSatelliteClick}
        />
      </Box>
    </ThemeProvider>
  );
};

export default App; 