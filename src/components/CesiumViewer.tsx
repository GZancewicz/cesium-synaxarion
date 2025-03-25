import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Box } from '@mui/material';
import { Satellite } from '../types/satellites';

// Initialize the Cesium ion access token (using default token)
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjY0NDE0OH0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxY';

interface CesiumViewerProps {
  satellites: Satellite[];
  onSatelliteClick?: (satellite: Satellite) => void;
}

const CesiumViewer: React.FC<CesiumViewerProps> = ({ satellites, onSatelliteClick }) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const entitiesRef = useRef<Cesium.Entity[]>([]);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Initialize the Cesium viewer
    const viewer = new Cesium.Viewer(cesiumContainer.current, {
      animation: false,
      baseLayerPicker: true,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: true,
      sceneModePicker: true,
      selectionIndicator: true,
      timeline: false,
      navigationHelpButton: true,
      navigationInstructionsInitiallyVisible: false,
    });

    // Close the base layer picker after a short delay to ensure it's initialized
    setTimeout(() => {
      if (viewer.baseLayerPicker) {
        const pickerElement = viewer.baseLayerPicker.container.getElementsByClassName('cesium-baseLayerPicker-dropDown')[0] as HTMLElement;
        if (pickerElement) {
          pickerElement.style.display = 'none';
        }
      }
    }, 100);

    // Set up terrain and imagery
    Cesium.createWorldTerrainAsync().then(terrainProvider => {
      viewer.terrainProvider = terrainProvider;
    });

    // Set up imagery
    const imageryLayer = viewer.imageryLayers.addImageryProvider(
      new Cesium.OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/'
      })
    );

    // Set up scene
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.baseColor = Cesium.Color.BLACK;
    viewer.scene.backgroundColor = Cesium.Color.BLACK;
    viewer.scene.skyBox = new Cesium.SkyBox({
      sources: {
        positiveX: '',
        negativeX: '',
        positiveY: '',
        negativeY: '',
        positiveZ: '',
        negativeZ: ''
      }
    });
    viewer.scene.sun = new Cesium.Sun();
    viewer.scene.moon = new Cesium.Moon();
    
    // Hide celestial bodies but keep terrain and imagery
    viewer.scene.sun.show = false;
    viewer.scene.moon.show = false;
    viewer.scene.skyBox.show = false;
    viewer.scene.globe.show = true;

    // Enable depth testing
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // Set initial camera position centered on Earth
    const earthPosition = Cesium.Cartesian3.fromDegrees(0, 0, 10000000);
    viewer.camera.setView({
      destination: earthPosition,
      orientation: {
        heading: 0.0,
        pitch: Cesium.Math.toRadians(-60),
        roll: 0.0
      }
    });

    // Disable automatic camera movements
    viewer.scene.screenSpaceCameraController.enableInputs = true;
    viewer.scene.screenSpaceCameraController.enableZoom = true;
    viewer.scene.screenSpaceCameraController.enableRotate = true;
    viewer.scene.screenSpaceCameraController.enableTilt = true;
    viewer.scene.screenSpaceCameraController.enableLook = true;

    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
    };
  }, []);

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current;
    const entities = viewer.entities;

    // Clear existing entities
    entitiesRef.current.forEach(entity => {
      entities.remove(entity);
    });
    entitiesRef.current = [];

    // Add satellites
    satellites.forEach((satellite) => {
      const position = Cesium.Cartesian3.fromDegrees(
        satellite.location.longitude,
        satellite.location.latitude
      );

      // Create the entity
      const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          satellite.location.longitude,
          satellite.location.latitude,
          satellite.location.altitude || 100000
        ),
        point: {
          pixelSize: 10,
          color: Cesium.Color.YELLOW,
        },
        label: {
          text: satellite.name,
          font: '14px sans-serif',
          fillColor: Cesium.Color.WHITE,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          outlineColor: Cesium.Color.BLACK,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK,
        },
        description: `<p>${satellite.info}</p>`
      });

      // Add point
      const pointEntity = entities.add({
        position,
        point: {
          pixelSize: 12,
          color: Cesium.Color.YELLOW.withAlpha(0.3),
          outlineColor: Cesium.Color.WHITE.withAlpha(0.5),
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.NONE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
      entitiesRef.current.push(pointEntity);

      // Add vertical line to ground
      const verticalLine = entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            satellite.location.longitude, satellite.location.latitude, satellite.location.altitude || 100000,
            satellite.location.longitude, satellite.location.latitude, 0
          ]),
          width: 2,
          material: new Cesium.ColorMaterialProperty(
            Cesium.Color.fromCssColorString('#808080').withAlpha(0.3)
          ),
          clampToGround: false,
          classificationType: Cesium.ClassificationType.BOTH,
          zIndex: 100
        }
      });
      entitiesRef.current.push(verticalLine);

      if (onSatelliteClick) {
        viewer.screenSpaceEventHandler.setInputAction((movement: any) => {
          const pickedObject = viewer.scene.pick(movement.position);
          if (Cesium.defined(pickedObject) && pickedObject.id === pointEntity) {
            onSatelliteClick(satellite);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }

      entitiesRef.current.push(entity);
    });
  }, [satellites, onSatelliteClick]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'black',
        '& .cesium-viewer': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }
      }}
    >
      <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};

export default CesiumViewer; 