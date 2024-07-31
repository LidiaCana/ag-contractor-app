export interface UserFields {
    username: string;
    password: string;
    role: string[];
    avatar: string;
    email: string;
    "id (from Role)": number[];  
}
export interface ProjectFields {
  name: string;
  general_contractor: string;
  contractor: string;
  address: string;
  project_manager: string;
  competent_person: string;
  start_date: string;
  end_date?: string;
  ProjectAttendance?: string[];
  status?: string;
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
    project: string | string[];
    date: string;
    group: string[];
    signature: string;
    "check-in": string;
    "check-out": string;
   
  }
export interface AttendeeResponseFields extends AttendeeFields {
  "name (from project)": string;
  "name (from group)": string;
  hours_worked: number;
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