export interface HistoricalFigure {
  id: string;
  name: string;
  type: 'saint' | 'bishop' | 'monk' | 'emperor' | 'other';
  birthYear?: number;
  deathYear?: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  type: 'guided_by' | 'lived_under' | 'knew';
  bidirectional: boolean;
}

export interface ConnectionType {
  id: 'guided_by' | 'lived_under' | 'knew';
  label: string;
  color: string;
  bidirectional: boolean;
} 