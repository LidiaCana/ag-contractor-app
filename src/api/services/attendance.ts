import { type AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosConfig';
import { type AirTableResponse, type AttendeeFields, type Record, type UpdateScheduleAttendeeFields } from '@/types/api';
import { ENDPOINTS_AIRTABLE } from '@/api/endpoints';
import { logger } from '@/lib/default-logger';
import { toast } from 'react-toastify';

class AttendanceService {
    async getAttendance<T>( query?: string ): Promise<Record<T>[]> {
        try {
            const { data } = await axiosInstance.get<
              AxiosResponse<AirTableResponse<T>>,
              { data: AirTableResponse<T> }
            >(`${ENDPOINTS_AIRTABLE.getAttendance()}${query ? `?${query}` : ''}`);
            return (data.records); // Update the type of the argument
          } catch (error) {
            this.handleError(error as never);
            throw error;
          }
      
    }

    async createAttendance(data: AttendeeFields): Promise<void> {
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
            
             response.status===200? toast.success('New Attendance created'):toast.error('error');
          } catch (error) {
            this.handleError(error as never);
            throw error;
          }
    }
    async updateSchedule(data: UpdateScheduleAttendeeFields[]): Promise<void> {
      try {
        logger.debug({data})
          const response  =await axiosInstance.patch(ENDPOINTS_AIRTABLE.createAttendance(), { records: data }); 
          
           response.status===200? toast.success('Schedule sent'):toast.error('error');
        } catch (error) {
          this.handleError(error as never);
          throw error;
        }
  }
    private handleError(error: never): void {
        if (error) {
           toast.error(error);
          
     
        } else {
          toast.error('An unexpected error occurred');
          logger.error('An unexpected error occurred');
        }
      }
}
export default new AttendanceService();