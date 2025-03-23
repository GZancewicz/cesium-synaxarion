export interface HistoricalFigure {
    id: string;
    name: string;
    type: 'saint' | 'emperor';
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
    location: {
        latitude: number;
        longitude: number;
    };
    info: string;
} 