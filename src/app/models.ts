export class Printer {
    id: number;
    name: string;
    available: string;
    reserved: boolean;
}

export class SensorData {
    timestamp: number;
    values: Values[];
}

export class Values {
    value: number;
    unit: string;
    name: string;
}

export const MockedPrinters: Printer[] = [
    { id: 1, name: 'Green', available: 'Yes', reserved: false },
    { id: 2, name: 'Blue', available: 'Yes', reserved: false },
    { id: 3, name: 'Yellow', available: 'No', reserved: true },
    { id: 4, name: 'Red', available: 'No', reserved: true },
    { id: 5, name: 'Black', available: 'No', reserved: true }
];