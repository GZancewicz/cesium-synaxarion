export interface DateValue {
  year: number;
  range?: {
    start: number;
    end: number;
  };
  isApproximate?: boolean;
}

export interface Dates {
  birth?: DateValue;
  death?: DateValue;
}

export interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export type FigureType = 'saint' | 'emperor';

export interface HistoricalFigure {
  id: string;
  name: string;
  type: string;
  dates: {
    birth?: {
      year: number;
      isApproximate: boolean;
    };
    death?: {
      year: number;
      isApproximate: boolean;
    };
  };
  location: Location;
  info: string;
}

export type ConnectionType = 'lived_under' | 'guided_by';

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  type: string;
  bidirectional: boolean;
}

export interface HistoricalData {
  figures: HistoricalFigure[];
  connections: Connection[];
} 