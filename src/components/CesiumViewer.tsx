import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { HistoricalFigure, Connection } from '../types';
import { Box } from '@mui/material';

// Initialize the Cesium ion access token (using default token)
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjY0NDE0OH0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxY';

interface CesiumViewerProps {
  figures: HistoricalFigure[];
  connections: Connection[];
  onFigureClick?: (figure: HistoricalFigure) => void;
}

const CesiumViewer: React.FC<CesiumViewerProps> = ({ figures, connections, onFigureClick }) => {
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
      infoBox: false,
      sceneModePicker: true,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: true,
      navigationInstructionsInitiallyVisible: false,
    });

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

    viewerRef.current = viewer;

    // Set initial camera position with a more dramatic view
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(32.0, 39.0, 3000000), // Centered between Constantinople and Caesarea
      orientation: {
        heading: Cesium.Math.toRadians(30),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0
      }
    });

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

    // Add figures
    figures.forEach(figure => {
      const year = figure.birthYear && figure.deathYear
        ? (figure.birthYear + figure.deathYear) / 2
        : figure.birthYear || figure.deathYear || 0;

      const height = Math.max(200000, year * 100); // Increased minimum height for better visibility

      const entity = entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          figure.location.longitude,
          figure.location.latitude,
          height
        ),
        point: {
          pixelSize: 12,
          color: Cesium.Color.GOLD,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.NONE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
          text: figure.name,
          font: '16px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          showBackground: true,
          backgroundColor: new Cesium.Color(0, 0, 0, 0.7),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000000),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
      });

      if (onFigureClick) {
        viewer.screenSpaceEventHandler.setInputAction((movement: any) => {
          const pickedObject = viewer.scene.pick(movement.position);
          if (Cesium.defined(pickedObject) && pickedObject.id === entity) {
            onFigureClick(figure);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }

      entitiesRef.current.push(entity);
    });

    // Add connections
    connections.forEach(connection => {
      const fromFigure = figures.find(f => f.id === connection.fromId);
      const toFigure = figures.find(f => f.id === connection.toId);

      if (!fromFigure || !toFigure) return;

      const fromYear = fromFigure.birthYear && fromFigure.deathYear
        ? (fromFigure.birthYear + fromFigure.deathYear) / 2
        : fromFigure.birthYear || fromFigure.deathYear || 0;

      const toYear = toFigure.birthYear && toFigure.deathYear
        ? (toFigure.birthYear + toFigure.deathYear) / 2
        : toFigure.birthYear || toFigure.deathYear || 0;

      const fromHeight = Math.max(200000, fromYear * 100);
      const toHeight = Math.max(200000, toYear * 100);

      const fromPosition = Cesium.Cartesian3.fromDegrees(
        fromFigure.location.longitude,
        fromFigure.location.latitude,
        fromHeight
      );

      const toPosition = Cesium.Cartesian3.fromDegrees(
        toFigure.location.longitude,
        toFigure.location.latitude,
        toHeight
      );

      const entity = entities.add({
        polyline: {
          positions: [fromPosition, toPosition],
          width: 3,
          material: new Cesium.ColorMaterialProperty(
            connection.type === 'guided_by' ? Cesium.Color.RED.withAlpha(0.8) : Cesium.Color.WHITE.withAlpha(0.8)
          ),
          clampToGround: false,
          depthFailMaterial: new Cesium.ColorMaterialProperty(
            connection.type === 'guided_by' ? Cesium.Color.RED.withAlpha(0.4) : Cesium.Color.WHITE.withAlpha(0.4)
          )
        },
      });

      entitiesRef.current.push(entity);
    });

    // Zoom to entities with a better view
    viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(30),
      Cesium.Math.toRadians(-45),
      2000000
    ));
  }, [figures, connections, onFigureClick]);

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