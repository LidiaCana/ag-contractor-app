import { type AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosConfig';
import { type AirTableResponse, type ProjectFields, type Record } from '@/types/api';
import { ENDPOINTS_AIRTABLE } from '@/api/endpoints';
import { logger } from '@/lib/default-logger';
import { toast } from 'react-toastify';

class ProjectService {
    async getProjects(): Promise<Record<ProjectFields>[]> {
        try {
            const { data } = await axiosInstance.get<
              AxiosResponse<AirTableResponse<ProjectFields>>,
              { data: AirTableResponse<ProjectFields> }
            >(ENDPOINTS_AIRTABLE.Projects());
            return (data.records); // Update the type of the argument
          } catch (error) {
            this.handleError(error as never);
            throw error;
          }
      
    }
    async createProject(data: ProjectFields): Promise<Record<ProjectFields>> {
        try {
            const response = await axiosInstance.post<
            AxiosResponse<AirTableResponse<ProjectFields>>,
            { data: AirTableResponse<ProjectFields> }
          >(ENDPOINTS_AIRTABLE.Projects(), {records:[{fields :data}]});
          response?toast.success('New Project created'):toast.error('error');
          return  response.data.records[0];
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