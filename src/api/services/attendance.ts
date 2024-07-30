import { type AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosConfig';
import { type AirTableResponse, type AttendeeFields, type Record } from '@/types/api';
import { ENDPOINTS_AIRTABLE } from '@/api/endpoints';
import { logger } from '@/lib/default-logger';
import { toast } from 'react-toastify';

class AttendanceService {
   chunkArray(array: never[], chunkSize: number): never[][] {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  }
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

    async createAttendance(data: {records:{fields : AttendeeFields}[]}): Promise<void> {
        try {
            const responses: AxiosResponse[] = [];
            const chunkedAttendances = this.chunkArray(data.records as never, 10);
          // logger.debug(request.length);
          chunkedAttendances.forEach(async (records) => {
              responses.push(await axiosInstance.post(ENDPOINTS_AIRTABLE.createAttendance(), {records}  )); 
             })
             responses.some((response) => response.status>=400)? toast.error('error'):toast.success('New Attendance created');
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