import { Service } from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {AutomationRun} from '../model/automationRun';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {inject} from '@angular/core';

@Service()
export class AutomationRunsService {
  private http = inject(HttpClient);
  constructor() {}

  getAllAutomationRuns():Observable<AutomationRun[]>{
    const requestUrl: string = "http://127.0.0.1:8080/api/automation-runs";
    return this.http.get<AutomationRun[]>(requestUrl).pipe(catchError(this.handleError));
  }

  postRetryRun(id:number):Observable<Object>{
    const requestUrl: string = "http://127.0.0.1:8080/api/automation-runs/"+ id +"/retry";
    return this.http.post<AutomationRun[]>(requestUrl,null).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
