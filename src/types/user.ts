export interface User {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
  role?: number;
  [key: string]: unknown;
}

export enum Role {
  Admin= 1,
  Supervisor= 2,
  Counter= 3,  
  
}