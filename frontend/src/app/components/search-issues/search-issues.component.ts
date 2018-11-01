import { UserService } from './../../services/user.service';
import { User } from './../../user.model';
import { IssueService } from './../../services/issue.service';
import { Issue } from './../../issue.model';
import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-search-issues',
  templateUrl: './search-issues.component.html',
  styleUrls: ['./search-issues.component.css']
})
export class SearchIssuesComponent implements OnInit {

  issues$: Observable<Issue[]>;
  private searchTerms = new Subject<string>();

  constructor(private issueService: IssueService) { }

  ngOnInit(): void {
    this.issues$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.issueService.searchIssues(term)),
    );
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

}
