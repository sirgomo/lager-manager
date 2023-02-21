import { ROLE } from "./regUsers.dto";

export class UserDataDto{
  id!: number;
  vorname!:string;
  nachname!:string;
  username!: string;
  role!: ROLE;
}
