export interface UserFields {
    username: string;
    password: string;
    role: string[];
    avatar: string;
    email: string;
    "id (from Role)": number[];  
}
export interface ProjectFields {
    start_date: string;
    ProjectAttendance: string[];
    status: string;
    end_date: string;
    contractor: string;
    supervisor: string[];
    name: string;
    client: string;
    address: string;
    nameFromSupervisor: string[];
  }
  

export interface EmployeeFields {
    email: string;
    Projects: string[];
    role: string[];
    name: string;
    nameFromRole: string[];
  }
export interface SubcontractorFields {
    name: string;
    phone: string; 
}
export interface AttendeeFields {
    name: string;
    project: string;
    date: string;
    subcontractor: string;
    hours_worked: number;
    is_employee: boolean;
    signature: string;
   
  }
export interface AttendeeResponseFields extends AttendeeFields {
  "name (from project)": string;
  "name (from subcontractor)": string;
  }
export interface Record<T> {
    id: string;
    createdTime: string;
    fields: T; 
}
export interface AirTableResponse<T> {
    records: Record<T>[]; 
    offset?: string;
}