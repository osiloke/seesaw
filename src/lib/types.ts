export interface RequestDetail {
  id: string;
  method: string;
  timestamp: string;
  ip: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body: string;
  path: string;
}
