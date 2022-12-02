export class RegisterUsersDto{
  id!:number;

  username! : string;

  userpassword!: string;

  vorname!:string;

  nachname!:string;

  role!: ROLE;
}
export enum ROLE{
  KOMMISIONIER = 'KOMMISIONIER',
  KONTROLLER = 'KONTROLLER',
  WARENPFHLEGE = 'WARENPFHLEGE',
  WARENEINGANG = 'WARENEINGANG',
  LAGERVERWALTUNG = 'LAGERVERWALTUNG',
  ADMIN = 'ADMIN',
  KAUF = 'KAUF',
  VERKAUF = 'VERKAUF'
}
