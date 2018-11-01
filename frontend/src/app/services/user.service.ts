import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Promise } from 'q';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = 'http://localhost:4000/back-issues';

  constructor(private http: HttpClient) { }

  authenticate(name, password) {
    const user = {
      name: name,
      password: password
    };
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.uri}/authenticate`, user, {headers: headers});
  }

  getUsers() {
    return this.http.get(`${this.uri}/users`);
  }

  getUserById(id) {
    return this.http.get(`${this.uri}/users/${id}`);
  }

  getUsersByName(name) {
    return this.http.get(`${this.uri}/users/search-name/${name}`);
  }

  getUserByManager(manager) {
    return this.http.get(`${this.uri}/users/search-manager/${manager}`);
  }

  addUser(name, password, manager, status) {
    const user = {
      name: name,
      password: password,
      manager: manager,
      status: status
    };
    return this.http.post(`${this.uri}/users/add`, user);
  }

  updateUser(id, name, password, manager, status) {
    const user = {
      name: name,
      password: password,
      manager: manager,
      status: status
    };
    return this.http.post(`${this.uri}/users/update/${id}`, user);
  }

  deleteUser(id) {
    return this.http.get(`${this.uri}/users/delete/${id}`);
  }
}
