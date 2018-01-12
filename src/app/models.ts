export interface Annotation {
  _id?: string;
  X_start: number;
  Y_start: number;
  X_end: number;
  Y_end: number;
}

export interface Metadata {
  _id?: string;
  cars: Annotation[];
  people: Annotation[];
  injury: Annotation[];
}
