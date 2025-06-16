import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ExternalSystem, CreateSystemForm } from './external-system.component';

@Injectable({
  providedIn: 'root'
})
export class ExternalSystemService {
  private readonly apiUrl = 'api/external-systems';

  constructor(private http: HttpClient) {}

  getSystems(): Observable<ExternalSystem[]> {
    return this.http.get<ExternalSystem[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<ExternalSystem[]>('getSystems', []))
      );
  }

  getSystem(id: number): Observable<ExternalSystem | undefined> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ExternalSystem>(url)
      .pipe(
        catchError(this.handleError<ExternalSystem>(`getSystem id=${id}`))
      );
  }

  createSystem(systemData: CreateSystemForm): Observable<ExternalSystem> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    const payload = {
      configName: systemData.name,
      baseUrl: systemData.baseUrl,
      authMethod: systemData.authMethod,
      configKey: systemData.key,
      authPlace: systemData.authPlace
    };

    return this.http.post<ExternalSystem>(this.apiUrl, payload, { headers })
      .pipe(
        catchError(this.handleError<ExternalSystem>('createSystem'))
      );
  }

  updateSystem(id: number, systemData: Partial<ExternalSystem>): Observable<ExternalSystem> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.put<ExternalSystem>(url, systemData, { headers })
      .pipe(
        catchError(this.handleError<ExternalSystem>('updateSystem'))
      );
  }

  testConnection(id: number): Observable<{ success: boolean; message: string }> {
    const url = `${this.apiUrl}/${id}/test`;
    
    return this.http.post<{ success: boolean; message: string }>(url, {})
      .pipe(
        catchError(this.handleError<{ success: boolean; message: string }>('testConnection', 
          { success: false, message: 'Connection test failed' }))
      );
  }

  getSystemPlanners(systemId: number): Observable<any[]> {
    const url = `${this.apiUrl}/${systemId}/planners`;
    
    return this.http.get<any[]>(url)
      .pipe(
        catchError(this.handleError<any[]>('getSystemPlanners', []))
      );
  }

  searchSystems(term: string): Observable<ExternalSystem[]> {
    if (!term.trim()) {
      return this.getSystems();
    }
    
    const url = `${this.apiUrl}/search?q=${encodeURIComponent(term)}`;
    
    return this.http.get<ExternalSystem[]>(url)
      .pipe(
        catchError(this.handleError<ExternalSystem[]>('searchSystems', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}