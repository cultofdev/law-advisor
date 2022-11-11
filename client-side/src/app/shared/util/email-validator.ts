import { AdminService } from './../services/admin.service';
import { AbstractControl } from '@angular/forms';
import { UrlEndpoint } from '../util/url-endpoint';

import { map } from 'rxjs/operators';

export class EmailValidator {

    static emailValidator(adminService: AdminService) {
        return (abstractControl: AbstractControl) => {
            const params = {
                username: abstractControl.value
            };

            return adminService.checkEmail(UrlEndpoint.ADMIN.GET, params).pipe(
                map(res => {
                    return res.length !== 0 ? { exists: true } : null;
                })
            );
        };
    }
}