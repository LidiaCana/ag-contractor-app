export interface UserFields {
    username: string;
    password: string;
    role: string[];
    avatar: string;
    email: string;
    "id (from Role)": number[];  
}

export interface Record<T> {
    id: string;
    createdTime: string;
    fields: T; 
}
export interface AirTableResponse<T> {
    records: Record<T>[]; 
}