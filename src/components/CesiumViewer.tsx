import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { HistoricalFigure, Connection } from '../types';

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
      fullscreenButton: true,
      geocoder: true,
      homeButton: true,
      navigationHelpButton: true,
      sceneModePicker: true,
      timeline: false,
    });

    // Set up terrain provider
    Cesium.createWorldTerrainAsync().then(terrainProvider => {
      viewer.terrainProvider = terrainProvider;
    });

    viewerRef.current = viewer;

    // Set initial camera position
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(0, 0, 10000000),
      orientation: {
        heading: 0,
        pitch: -Math.PI / 2,
        roll: 0,
      },
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

      const height = year * 100; // Scale factor for height

      const entity = entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          figure.location.longitude,
          figure.location.latitude,
          height
        ),
        billboard: {
          image: getFigureIcon(figure.type),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scale: 0.5,
        },
        label: {
          text: figure.name,
          font: '14px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -10),
        },
      });

      if (onFigureClick) {
        // Add click handler through the viewer's screen space event handler
        viewer.screenSpaceEventHandler.setInputAction(() => {
          onFigureClick(figure);
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

      const fromHeight = fromYear * 100;
      const toHeight = toYear * 100;

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
          positions: new Cesium.CallbackProperty(() => {
            return [fromPosition, toPosition];
          }, false),
          width: 2,
          material: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(getConnectionColor(connection.type))),
          clampToGround: false,
        },
      });

      entitiesRef.current.push(entity);
    });
  }, [figures, connections, onFigureClick]);

  return <div ref={cesiumContainer} style={{ width: '100%', height: '100vh' }} />;
};

const getFigureIcon = (type: string): string => {
  // TODO: Replace with actual icon paths
  switch (type) {
    case 'saint':
      return '/icons/saint.png';
    case 'bishop':
      return '/icons/bishop.png';
    case 'monk':
      return '/icons/monk.png';
    case 'emperor':
      return '/icons/emperor.png';
    default:
      return '/icons/other.png';
  }
};

const getConnectionColor = (type: string): string => {
  switch (type) {
    case 'guided_by':
      return '#FF0000';
    case 'lived_under':
      return '#00FF00';
    case 'knew':
      return '#0000FF';
    default:
      return '#FFFFFF';
  }
};

export default CesiumViewer; 