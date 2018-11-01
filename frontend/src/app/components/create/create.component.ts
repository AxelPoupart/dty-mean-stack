import { UserService } from './../../services/user.service';
import { User } from './../../user.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  id: String;
  createForm: FormGroup;

  constructor(private issueService: IssueService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: '',
      severity: ''
    });
  }

  addIssue( title, description, severity) {

    this.userService.getUserById(this.id).subscribe((res: User) => {
      const responsible = res.name;
      this.issueService.addIssue(title, responsible, description, severity).subscribe(() => {
        this.router.navigate([`/list/${this.id}`]);
      });
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
    });
  }

  back() {
    this.router.navigate([`/list/${this.id}`]);
  }

}
