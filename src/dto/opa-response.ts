export interface OpaResponse<T> {
  decision_id: string;
  result: T | undefined;
}