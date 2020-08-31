import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {
  constructor(private http: HttpClient) {}
  public getYouBikeData(): Observable<any> {
    const URL = 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-A0012-001?Authorization=CWB-7F644CDD-7D6E-405B-8667-A50C29B5C103&format=JSON';
    return this.http.get<any>(URL);
  }
  public HandleError(e: any): void {
    // console.log(e);
    alert(e.error.error);
  }

}