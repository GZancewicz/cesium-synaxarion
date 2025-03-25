interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
}

export async function getISSPosition(): Promise<ISSPosition> {
  try {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    if (!response.ok) {
      throw new Error('Failed to fetch ISS position');
    }
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      // Convert altitude to meters for Cesium (API returns kilometers)
      altitude: data.altitude * 1000,
      velocity: data.velocity,
      timestamp: data.timestamp
    };
  } catch (error) {
    console.error('Error fetching ISS position:', error);
    throw error;
  }
} 