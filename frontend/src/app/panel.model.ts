import { Issue } from './issue.model';
import { User } from './user.model';


export interface Panel {
  user: User;
  issues: Issue[];
}
