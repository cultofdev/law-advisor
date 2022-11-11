import { environment } from "src/environments/environment";

export class UrlEndpoint {
    static AUTH = {
        SIGNIN: `${environment.AUTH_API_URL}/auth/login`
    }

    static ADMIN = {
        GET: `${environment.ADMIN_API_URL}/users`,
        POST: `${environment.ADMIN_API_URL}/users`,
    }

    static TODO = `${environment.TODO_API_URL}/todo`;
}