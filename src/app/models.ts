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
    { id: 1, name: 'Green', available: 'No', reserved: true },
    { id: 2, name: 'Blue', available: 'No', reserved: true },
    { id: 3, name: 'Yellow', available: 'Yes', reserved: false },
    { id: 5, name: 'Black', available: 'Yes', reserved: false },
    { id: 4, name: 'Red', available: 'No', reserved: true },
];

export const MockedPrinters2: Printer[] = [
    { id: 5, name: 'Black', available: 'Yes', reserved: false },
    { id: 3, name: 'Yellow', available: 'Yes', reserved: true },
    { id: 4, name: 'Red', available: 'No', reserved: true },
    { id: 1, name: 'Green', available: 'No', reserved: true },
    { id: 2, name: 'Blue', available: 'No', reserved: true },
];

export const MockedPrinters3: Printer[] = [
    { id: 5, name: 'Black', available: 'Yes', reserved: false },
    { id: 3, name: 'Yellow', available: 'No', reserved: true },
    { id: 4, name: 'Red', available: 'No', reserved: true },
    { id: 1, name: 'Green', available: 'No', reserved: true },
    { id: 2, name: 'Blue', available: 'No', reserved: true },
];

export const MockedPrinters4: Printer[] = [
    { id: 5, name: 'Black', available: 'Yes', reserved: false },
    { id: 1, name: 'Green', available: 'Yes', reserved: false },
    { id: 3, name: 'Yellow', available: 'No', reserved: true },
    { id: 4, name: 'Red', available: 'No', reserved: true },
    { id: 2, name: 'Blue', available: 'No', reserved: true },
];