export interface SignalrMessage<T> {
  payload: T;
  type: string;
}