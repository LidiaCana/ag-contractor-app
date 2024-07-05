import { type AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosConfig';
import { type AirTableResponse, type ProjectFields, type Record } from '@/types/api';
import { ENDPOINTS_AIRTABLE } from '@/api/endpoints';
import { logger } from '@/lib/default-logger';

class ProjectService {
    async getProjects(): Promise<Record<ProjectFields>[]> {
        try {
            const { data } = await axiosInstance.get<
              AxiosResponse<AirTableResponse<ProjectFields>>,
              { data: AirTableResponse<ProjectFields> }
            >(ENDPOINTS_AIRTABLE.getProjects());
            return (data.records); // Update the type of the argument
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
export default new ProjectService();