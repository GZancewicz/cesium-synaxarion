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
}

export type FigureType = 'saint' | 'emperor';

export interface HistoricalFigure {
  id: number;
  name: string;
  type: FigureType;
  dates: Dates;
  location: Location;
  info: string;
}

export type ConnectionType = 'lived_under' | 'guided_by';

export interface Connection {
  fromId: number;
  toId: number;
  type: ConnectionType;
}

export interface HistoricalData {
  figures: HistoricalFigure[];
  connections: Connection[];
} 