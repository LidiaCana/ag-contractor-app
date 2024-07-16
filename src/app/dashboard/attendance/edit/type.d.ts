export interface AttendanceGroupInterface {
    name: string;
    project: string[];
    date: string;
    subcontractor: string[];
    'name (from project)': string;
    'name (from subcontractor)': string;
    attendance?: Record<{ name: string;
        project: string[];
        date: string;
        subcontractor: string[];
        'name (from project)': string;
        'name (from subcontractor)': string;}>[];
  }