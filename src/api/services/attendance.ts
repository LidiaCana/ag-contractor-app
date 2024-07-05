import { type AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosConfig';
import { type AirTableResponse, type AttendeeFields, type Record } from '@/types/api';
import { ENDPOINTS_AIRTABLE } from '@/api/endpoints';
import { logger } from '@/lib/default-logger';

class AttendanceService {
    async getAttendance(): Promise<Record<AttendeeFields>[]> {
        try {
            const { data } = await axiosInstance.get<
              AxiosResponse<AirTableResponse<AttendeeFields>>,
              { data: AirTableResponse<AttendeeFields> }
            >(ENDPOINTS_AIRTABLE.getAttendance());
            return (data.records); // Update the type of the argument
          } catch (error) {
            this.handleError(error as never);
            throw error;
          }
      
    }
    async createAttendance(data: AttendeeFields): Promise<string> {
        try {
            const fields = {
                       "name": data.name,
                    "project": [
                     data.project
                    ],
                    "date": data.date,
                    "hours_worked": 8,
                    "subcontractor": [
                      data.subcontractor
                    ],
                    "signature": data.signature
                  
            }
            const response  =await axiosInstance.post(ENDPOINTS_AIRTABLE.createAttendance(), { fields }); 
            return response.status===200?'success':'error';
          } catch (error) {
            this.handleError(error as never);
            throw error;
          }
    }
    private handleError(error: never): void {
        if (error) {
          // toast.error(`Error: ${error.response?.data.message || error.message}`);
          logger.error(error);
        } else {
          // toast.error('An unexpected error occurred');
          logger.error('An unexpected error occurred');
        }
      }
}
export default new AttendanceService();