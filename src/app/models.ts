export class Printer {
    id: number;
    name: string;
    available: boolean;
    reserved: boolean;
}

export const MockedPrinters: Printer[] = [
    { id: 1, name: 'Green', available: true, reserved: false },
    { id: 2, name: 'Blue', available: true, reserved: false },
    { id: 3, name: 'Yellow', available: true, reserved: false },
    { id: 4, name: 'Red', available: true, reserved: false },
    { id: 5, name: 'Black', available: true, reserved: false }
];