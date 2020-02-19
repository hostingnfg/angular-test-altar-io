export interface Payment {
  payment: string;
  amount: string;
  code: string;
  grid: Map<number, Map<number, string>>;
}
