import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Box } from '@mui/material';
import { HistoricalFigure, DateValue, Connection } from '../types/historical-figures';

// Initialize the Cesium ion access token (using default token)
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjY0NDE0OH0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxY';

const getDateLabel = (dates: HistoricalFigure['dates']): string => {
  if (!dates.birth && !dates.death) return '';

  const formatDateValue = (date: DateValue, prefix?: string): string => {
    if (date.range) {
      const rangeStr = `${date.range.start}-${date.range.end}`;
      return date.isApproximate ? `ca. ${rangeStr}` : rangeStr;
    }
    return date.isApproximate ? `ca. ${date.year}` : `${date.year}`;
  };

  if (dates.birth && dates.death) {
    return `${formatDateValue(dates.birth)} - ${formatDateValue(dates.death)}`;
  }
  if (dates.birth) {
    return `b. ${formatDateValue(dates.birth)}`;
  }
  if (dates.death) {
    return `d. ${formatDateValue(dates.death)}`;
  }
  return '';
};

const getYearForPosition = (dates: HistoricalFigure['dates']): number => {
  const getMidpoint = (date: DateValue): number => {
    if (date.range) {
      return Math.floor((date.range.start + date.range.end) / 2);
    }
    return date.year;
  };

  if (dates.death) {
    return getMidpoint(dates.death);
  }
  if (dates.birth) {
    return getMidpoint(dates.birth);
  }
  return 0;
};

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
    viewer.scene.globe.enableLighting = false;
    viewer.scene.globe.baseColor = Cesium.Color.WHITE;
    viewer.scene.backgroundColor = Cesium.Color.WHITE;
    viewer.scene.skyBox.show = false;
    viewer.scene.sun = new Cesium.Sun();
    viewer.scene.moon = new Cesium.Moon();
    viewer.scene.sun.show = false;
    viewer.scene.moon.show = false;
    viewer.scene.globe.show = true;
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // Set initial camera position centered on Corinth
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(22.9, 37.9, 2000000), // Corinth coordinates
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0
      }
    });

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

    // Add figures
    figures.forEach(figure => {
      const position = Cesium.Cartesian3.fromDegrees(
        figure.location.longitude,
        figure.location.latitude,
        figure.type === 'saint' ? 100000 : 50000  // Reduced height
      );

      const nameLabel = entities.add({
        position,
        label: {
          text: figure.name,
          font: '16px sans-serif',
          fillColor: figure.type === 'saint' ? 
            Cesium.Color.YELLOW : 
            Cesium.Color.fromCssColorString('#303030'),
          style: figure.type === 'saint' ? 
            Cesium.LabelStyle.FILL_AND_OUTLINE : 
            Cesium.LabelStyle.FILL,
          outlineWidth: figure.type === 'saint' ? 2 : 0,
          outlineColor: Cesium.Color.BLACK,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          backgroundColor: figure.type === 'saint' ? 
            Cesium.Color.BLACK : 
            undefined,
          showBackground: figure.type === 'saint',
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          distanceDisplayCondition: undefined,
          translucencyByDistance: undefined,
          scaleByDistance: undefined
        }
      });

      const dateLabel = entities.add({
        position,
        label: {
          text: getDateLabel(figure.dates),
          font: '14px sans-serif',
          fillColor: Cesium.Color.fromCssColorString('#808080'),
          style: Cesium.LabelStyle.FILL,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          pixelOffset: new Cesium.Cartesian2(8, 5),  // Offset to the right of pin and slightly down
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          distanceDisplayCondition: undefined,
          translucencyByDistance: undefined,
          scaleByDistance: undefined
        }
      });

      // Add point
      const pointEntity = entities.add({
        position,
        point: {
          pixelSize: 12,
          color: figure.type === 'saint' ? Cesium.Color.GOLD : Cesium.Color.GRAY,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.NONE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          distanceDisplayCondition: undefined  // Remove distance condition
        },
      });
      entitiesRef.current.push(pointEntity);

      // Add vertical line to ground
      const verticalLine = entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            figure.location.longitude, figure.location.latitude, 100000,  // Match point height
            figure.location.longitude, figure.location.latitude, 0
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

      if (onFigureClick) {
        viewer.screenSpaceEventHandler.setInputAction((movement: any) => {
          const pickedObject = viewer.scene.pick(movement.position);
          if (Cesium.defined(pickedObject) && pickedObject.id === pointEntity) {
            onFigureClick(figure);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }

      entitiesRef.current.push(nameLabel);
      entitiesRef.current.push(dateLabel);
    });

    // Add connections
    connections.forEach(connection => {
      const fromFigure = figures.find(f => f.id === connection.fromId);
      const toFigure = figures.find(f => f.id === connection.toId);

      if (!fromFigure || !toFigure) return;

      const height = 100000; // Use same fixed height as points

      const fromPosition = Cesium.Cartesian3.fromDegrees(
        fromFigure.location.longitude,
        fromFigure.location.latitude,
        height
      );

      const toPosition = Cesium.Cartesian3.fromDegrees(
        toFigure.location.longitude,
        toFigure.location.latitude,
        height
      );

      // Add the connection line
      const lineEntity = entities.add({
        polyline: {
          positions: [fromPosition, toPosition],
          width: 4, // Increased width to make arrow more visible
          material: connection.type === 'lived_under' ?
            new Cesium.PolylineArrowMaterialProperty(
              Cesium.Color.fromCssColorString('#808080').withAlpha(0.8)
            ) :
            new Cesium.ColorMaterialProperty(
              connection.type === 'guided_by' ? Cesium.Color.RED.withAlpha(0.8) :
              Cesium.Color.WHITE.withAlpha(0.8)
            ),
          clampToGround: false
        }
      });
      entitiesRef.current.push(lineEntity);

      // Add label at midpoint if it's a 'lived_under' connection
      if (connection.type === 'lived_under') {
        const midLongitude = (fromFigure.location.longitude + toFigure.location.longitude) / 2;
        const midLatitude = (fromFigure.location.latitude + toFigure.location.latitude) / 2;
        
        const labelEntity = entities.add({
          position: Cesium.Cartesian3.fromDegrees(midLongitude, midLatitude, height),
          label: {
            text: 'Lived under',
            font: '14px sans-serif',
            style: Cesium.LabelStyle.FILL,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            eyeOffset: new Cesium.Cartesian3(0, 0, -10000), // Offset towards viewer
            fillColor: Cesium.Color.fromCssColorString('#808080'),
            showBackground: true,
            backgroundColor: new Cesium.Color(0, 0, 0, 0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        });
        entitiesRef.current.push(labelEntity);
      }
    });

    // Zoom to entities with a better view
    viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(30),
      Cesium.Math.toRadians(-45),
      1000000  // Reduced range
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