export interface LoadableStore<T> {
  data: T | undefined;
  isLoading: boolean;
}