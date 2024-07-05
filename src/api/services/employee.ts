import { type AxiosResponse } from 'axios';
import { type AirTableResponse, type EmployeeFields, type Record } from '@/types/api';
import axiosInstance from '@/api/axiosConfig';
import { ENDPOINTS_AIRTABLE } from '@/api/endpoints';
import { logger } from '@/lib/default-logger';

class EmployeeService {
    async getEmployees(): Promise<Record<EmployeeFields>[]> {
        try {
            const { data } = await axiosInstance.get<
              AxiosResponse<AirTableResponse<EmployeeFields>>,
              { data: AirTableResponse<EmployeeFields> }
            >(ENDPOINTS_AIRTABLE.getEmployees());
            return (data.records); // Update the type of the argument
          } catch (error) {
            this.handleError(error as never);
            throw error;
          }
      
    }
  
    // async getEmployeeById(employeeId: string) {
    //   try {
        
    //   } catch (error) {
    //     this.handleError(error);
    //     throw error;
    //   }
    // }
  
    // async createEmployee(employee: EmployeeFields) {
    //   try {
        
  
    //   } catch (error) {
    //     this.handleError(error);
    //     throw error;
    //   }
    // }
  
    // async updateEmployee(employeeId: string, employee: EmployeeFields) {
    //   try {
   
    //   } catch (error) {
    //     this.handleError(error);
    //     throw error;
    //   }
    // }
  
    // async deleteEmployee(employeeId: string) {
    //   try {
       
    //   } catch (error) {
    //     this.handleError(error);
    //     throw error;
    //   }
    // }
  
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
  
  export default new EmployeeService();