import {User} from "./User";

export interface Review_User {
  userEmail: string;
  modelName: string;
  score: number;
  text: string;
  user: User[];
}
