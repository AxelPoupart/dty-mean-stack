import { Issue } from './../issue.model';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  uri = 'http://localhost:4000/back-issues';

  constructor(private http: HttpClient) { }

  getIssues() {
    return this.http.get(`${this.uri}/issues`);
  }

  getIssueById(id) {
    return this.http.get(`${this.uri}/issues/${id}`);
  }

  getIssuesByUser(user) {
    return this.http.get(`${this.uri}/issues/search-user/${user}`);
  }

  addIssue(title, responsible, description, severity) {
    const issue = {
      title: title,
      responsible: responsible,
      description: description,
      severity: severity
    };
    return this.http.post(`${this.uri}/issues/add`, issue);
  }

  updateIssue(id, title, responsible, description, severity, status) {
    const issue = {
      title: title,
      responsible: responsible,
      description: description,
      severity: severity,
      status: status
    };
    return this.http.post(`${this.uri}/issues/update/${id}`, issue);
  }


  deleteIssue(id) {
    return this.http.get(`${this.uri}/issues/delete/${id}`);
  }

  searchIssues(term: string): Observable<Issue[]> {
    if (!term.trim()) {
      // if not search term, return empty issue array.
      return of([]);
    }
    return this.http.get<Issue[]>(`${this.uri}/issues/search-title/${term}`);
  }
}
