import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FileSelectDirective } from 'ng2-file-upload';
import { HttpModule } from '@angular/http';

import { MatToolbarModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatIconModule } from '@angular/material';
import { MatButtonModule, MatCardModule, MatTableModule, MatDividerModule, MatSnackBarModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';
import { HomeComponent } from './components/home/home.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ManagingComponent } from './components/managing/managing.component';

import { IssueService } from './services/issue.service';
import { UserService } from './services/user.service';
import { ListUserComponent } from './components/list-user/list-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { SearchIssuesComponent } from './components/search-issues/search-issues.component';




const routes: Routes = [
  { path: 'create/:id', component: CreateComponent},
  { path: 'edit/:id', component: EditComponent},
  { path: 'list/:id', component : ListComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'connexion', component : ConnexionComponent},
  { path: 'home', component : HomeComponent},
  { path: 'create-user', component : CreateUserComponent},
  { path: 'managing/:id', component : ManagingComponent},
  { path: 'list-user', component : ListUserComponent},
  { path: 'edit-user/:id', component : EditUserComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CreateComponent,
    EditComponent,
    HomeComponent,
    ConnexionComponent,
    CreateUserComponent,
    ManagingComponent,
    ListUserComponent,
    EditUserComponent,
    SearchIssuesComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatExpansionModule,
    HttpModule
  ],
  providers: [IssueService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
