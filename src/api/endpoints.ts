

export const ENDPOINTS_AIRTABLE = {
 login: ({username, password}:{username: string, password: string}) => {
    const userTable = process.env.NEXT_PUBLIC_USER_TABLE || 'tblFZAvuMK8sLh6jf';
    const query = `AND({username}='${username}',{password}='${password}')`;
    const loginUrl =`/${userTable}?filterByFormula=${query}`
    return loginUrl
 },
 getProjects: () => {
    const projectsTable = process.env.NEXT_PUBLIC_AIRTABLE_PROJECTS_TABLE || 'tbl3rEng1xEXr3LcR';
    return `/${projectsTable}`
 }
 , getEmployees: () => {
      const employeesTable = process.env.NEXT_PUBLIC_EMPLOYEES_TABLE || 'tbl21mrDxINoJvHch';
      return `/${employeesTable}`
 }
   , getSubcontractors: () => {
         const subcontractorsTable = process.env.NEXT_PUBLIC_SUBCONTRACTOR_TABLE || 'tbl3G90QbRyAAz067';
         return `/${subcontractorsTable}`
   }
   , getAttendance: () => {
         const attendanceTable = process.env.NEXT_PUBLIC_ATTENDANCE_TABLE || 'tblMuaNXl3N3Sh75S';
         return `/${attendanceTable}`
   },
   createAttendance: () => {
      const attendanceTable = process.env.NEXT_PUBLIC_ATTENDANCE_TABLE || 'tblMuaNXl3N3Sh75S';
      return `/${attendanceTable}`
   }

} 