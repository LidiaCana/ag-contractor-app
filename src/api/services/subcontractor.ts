import { type AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosConfig';
import { type AirTableResponse, type Record, type SubcontractorFields } from '@/types/api';
import { ENDPOINTS_AIRTABLE } from '@/api/endpoints';
import { logger } from '@/lib/default-logger';

class SubcontractorService {
    async getSubcontractor(): Promise<Record<SubcontractorFields>[]> {
        try {
            const { data } = await axiosInstance.get<
              AxiosResponse<AirTableResponse<SubcontractorFields>>,
              { data: AirTableResponse<SubcontractorFields> }
            >(ENDPOINTS_AIRTABLE.Subcontractors());
            return (data.records); // Update the type of the argument
          } catch (error) {
            this.handleError(error as never);
            throw error;
          }
      
    }
    async createSubcontractor(data: SubcontractorFields): Promise<Record<SubcontractorFields>> {
        try {
            const { data: {records} } = await axiosInstance.post<
              AxiosResponse<Record<SubcontractorFields>>,
              { data: {records: Record<SubcontractorFields>[]}  }
            >(ENDPOINTS_AIRTABLE.Subcontractors(), { records: [{fields:data} ]});
           
            return records[0];
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
export default new SubcontractorService();