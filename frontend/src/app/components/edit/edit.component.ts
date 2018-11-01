import { User } from './../../user.model';
import { UserService } from './../../services/user.service';
import { Issue } from './../../issue.model';

import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { MatSnackBar } from '@angular/material';

import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { Http, Response } from '@angular/http';

// define the constant url we would be uploading to.
const URL = 'http://localhost:4000/back-issues/upload';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  // declare a property called fileuploader and assign it to an instance of a new fileUploader.
  // pass in the Url to be uploaded to, and pass the itemAlais, which would be the name of the //file input when sending the post request.
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'document'});

  id: String;
  issue: Issue;
  updateForm: FormGroup;

  constructor(private issueService: IssueService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private http: Http,
    private el: ElementRef) {

      this.createForm();

   }

   createForm() {
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      description: '',
      severity: '',
      status: ''
    });
   }



  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.issueService.getIssueById(this.id).subscribe((res: Issue) => {
        this.issue = res;
        this.updateForm.get('title').setValue(this.issue.title);
        this.updateForm.get('description').setValue(this.issue.description);
        this.updateForm.get('severity').setValue(this.issue.severity);
        this.updateForm.get('status').setValue(this.issue.status);
        console.log(this.issue);


      });
    });

    // override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    // overide the onCompleteItem property of the uploader so we are
    // able to deal with the server response.
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
     };
  }

  updateIssue(title, description, severity, status) {
    console.log(this.issue);
    if (!severity) {
      severity = this.issue.severity;
    }
    this.issueService.updateIssue(this.id, title, this.issue.responsible, description, severity, status).subscribe(() => {
      this.snackBar.open('Issue updated successfully!', 'OK', {
        duration: 3000
      });
    });
    this.userService.getUsersByName(this.issue.responsible).subscribe((users: User[]) => {
      console.log(users[0]);
      this.router.navigate([`/list/${users[0]._id}`]);
    });
  }

  upload() {
    // locate the file element meant for the file upload.
        const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    // get the total amount of files attached to the file input.
        const fileCount: number = inputEl.files.length;
    // create a new fromdata instance
        const formData = new FormData();
    // check if the filecount is greater than zero, to be sure a file was selected.
        if (fileCount > 0) { // a file was selected
            // append the key name 'photo' with the first file in the element
                formData.append('photo', inputEl.files.item(0));
            // call the angular http method
            this.http
        // post the form data to the url defined above and map the response.
        // Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
                .post(URL, formData).pipe(map((res: Response) => res.json())).subscribe(
                // map the success function and alert the response
                 (success) => {
                         alert(success._body);
                },
                (error) => alert(error));
          }
       }
}
