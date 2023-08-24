export default interface ListResponse<T> {
  count: number;
  limit: number;
  offset: number;
  results: T[];
  total: number;
}
