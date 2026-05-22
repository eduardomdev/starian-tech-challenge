export interface TableRowContext<T> {
  $implicit: T;
  index: number;
  first: boolean;
  last: boolean;
}
