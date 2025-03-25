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

export type SatelliteType = 'amateur' | 'weather' | 'iss';

export interface Satellite {
  id: string;
  name: string;
  type: string;
  location: Location;
  info: string;
}

export interface SatelliteData {
  satellites: Satellite[];
  connections: never[];
} 