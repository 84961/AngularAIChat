import { inject,Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';
import { UserContentRequest } from '../common/models';

@Injectable({
  providedIn: 'root',
})
export class CodeConverterService {
    private apiUrl:string = `${environment.backendEndpoint}/api/CodeConverter/convert-azure-ai`;
    http = inject(HttpClient);
  
    constructor() {}
  
    convertCode(request: UserContentRequest, modelName: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const params = new HttpParams().set('modelName', modelName);
    
        return this.http.post<any>(this.apiUrl, request, { 
            headers,
            params 
        });
    }
}