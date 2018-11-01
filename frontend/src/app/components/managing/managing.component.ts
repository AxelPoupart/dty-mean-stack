import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { MatAccordion} from '@angular/material';
import { MatExpansionModule} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSnackBar } from '@angular/material';

import { Issue } from '../../issue.model';
import { User } from '../../user.model';
import { Panel } from './../../panel.model';

import { IssueService } from '../../services/issue.service';
import { UserService } from './../../services/user.service';


@Component({
  selector: 'app-managing',
  templateUrl: './managing.component.html',
  styleUrls: ['./managing.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ManagingComponent implements OnInit {

  id: String;
  manager: User;
  panels: Panel[];
  users: User[];
  user: User;
  panel: Panel;
  issues: Issue[];
  disColIssues = ['title', 'responsible', 'severity', 'status', 'actions'];
  disColUsers = ['name'];

  constructor(private issueService: IssueService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initFunc();
  }

  initFunc() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.userService.getUserById(this.id).subscribe((manager: User) => {
        this.fetchUsers(manager.name);
        console.log('init : ' + manager.name);
        this.manager = manager;
      });
    });
  }

  fetchUsers(manager) {
    this.userService
    .getUserByManager(manager)
    .subscribe((data: User[]) => {
      console.log('fetchUsers : ');
      console.log(manager);
      this.users = data;
      console.log('Users requested...');
      this.boucleFor(data);
    });
  }

  fetchIssues(user) {
    this.issueService
    .getIssuesByUser(user.name)
    .subscribe((data: Issue[]) => {
      console.log('Issues displayed :');
      console.log(data);
      this.issues = data;
      this.fetchPanels(user, data);
    });
    }

  fetchPanels(user, issues) {
    const panel: Panel = {user: user, issues: issues};
    console.log(panel);
    if (this.panels === undefined ) {
      this.panels = [panel];
    } else {
      this.panels.push(panel);
      console.log('Voici le panel');
      console.log(this.panels);
    }
  }

  boucleFor(users) {
    console.log(users);
    for (const user of users ) {
      console.log(user);
      this.fetchIssues(user);
    }
  }

  editIssue(id) {
    this.router.navigate([`/edit/${id}`]);
  }

  deleteIssue(id, user) {
    this.issueService.deleteIssue(id).subscribe(() => {
      this.panels = [];
      this.initFunc();
    });
  }

  validateIssue(id) {
    this.issueService.getIssueById(id).subscribe((issue: Issue) => {
      this.issueService.updateIssue(issue._id, issue.title, issue.responsible, issue.description, issue.severity, 'Done').subscribe(() => {
        this.snackBar.open('Issue Accepted successfully!', 'OK', {
          duration: 3000
        });
        this.panels = [];
        this.initFunc();
      });
    });
  }

}
