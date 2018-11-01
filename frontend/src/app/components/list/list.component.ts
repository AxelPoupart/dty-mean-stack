import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { Issue } from '../../issue.model';
import { User } from '../../user.model';

import { IssueService } from '../../services/issue.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  id: String;
  user: User;
  issues: Issue[];
  displayedColumnsValidated = ['title', 'responsible', 'severity', 'status'];

  displayedColumns = ['title', 'responsible', 'severity', 'status', 'actions'];
  openIssues: Issue[];
  progressIssues: Issue[];
  closeIssues: Issue[];
  typeLine = ['Open Issues', 'In validation progress Issues', 'Validated Issues'];

  constructor(private issueService: IssueService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
    }

  ngOnInit() {
      this.route.params.subscribe(params => {
      this.id = params.id;
      this.userService.getUserById(this.id).subscribe((res: User) => {
      this.user = res;
      this.fetchIssues(res);
    });
  });
    console.log(this.openIssues);
    console.log(this.progressIssues);
    console.log(this.closeIssues);
}


  fetchIssues(user) {
    this.issueService
    .getIssuesByUser(user.name)
    .subscribe((data: Issue[]) => {
      this.issues = data;
      console.log('Data requested...');
      console.log(this.issues);
      this.sortIssues(data);
    });
  }

  sortIssues(issues) {
    this.openIssues = [];
    this.progressIssues = [];
    this.closeIssues = [];
    for (const issue of issues) {
      if (issue.status === 'Open') {
        this.openIssues.push(issue);
      }
      if (issue.status === 'In Progress') {
        this.progressIssues.push(issue);
      }
      if (issue.status === 'Done') {
        this.closeIssues.push(issue);
      }
    }
    console.log(this.openIssues);
    console.log(this.progressIssues);
    console.log(this.closeIssues);

  }

  editIssue(id) {
    this.router.navigate([`/edit/${id}`]);
  }

  askValidation(id) {
    this.issueService.getIssueById(id).subscribe((data: Issue) => {
      const currentIssue = data;
      this.issueService.updateIssue(
        id,
        currentIssue.title,
        currentIssue.responsible,
        currentIssue.description,
        currentIssue.severity,
        'In Progress')
        .subscribe(() => {this.fetchIssues(this.user); });
    });
  }

  deleteIssue(id) {
    this.issueService.deleteIssue(id).subscribe(() => {
      this.fetchIssues(this.user);
    });
  }

  createIssue(id) {
    this.router.navigate([`/create/${id}`]);
  }

}
