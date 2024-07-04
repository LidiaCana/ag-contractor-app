import { Credentials } from "@/components/auth/sign-in-form";

export const ENDPOINTS_AIRTABLE = {
 login: ({username, password}:Credentials) => {
    const userTable = process.env.REACT_APP_AIRTABLE_USER_TABLE || 'tblFZAvuMK8sLh6jf';
    const query = `AND({username}='${username}',{password}='${password}')`;
    const loginUrl =`/${userTable}?filterByFormula=${query}`
    return loginUrl
 },
} 