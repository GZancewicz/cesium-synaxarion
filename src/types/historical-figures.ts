export type DateValue = {
  year: number;
  isApproximate: boolean;
  range?: {
    start: number;
    end: number;
  };
};

export type Dates = {
  birth?: DateValue;
  death?: DateValue;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type FigureType = 'saint' | 'emperor';

export type HistoricalFigure = {
  id: string;
  name: string;
  type: FigureType;
  dates: Dates;
  location: Location;
};

export type ConnectionType = 'lived_under';

export type Connection = {
  id: string;
  fromId: string;
  toId: string;
  type: ConnectionType;
  bidirectional: boolean;
};

export type HistoricalData = {
  figures: HistoricalFigure[];
  connections: Connection[];
}; 