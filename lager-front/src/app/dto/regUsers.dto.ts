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
  DATAPFHLEGE = 'DATAPFHLEGE',
  WARENEINGANG = 'WARENEINGANG',
  LAGERVERWALTUNG = 'LAGERVERWALTUNG',
  ADMIN = 'ADMIN',
  KAUF = 'KAUF',
  VERKAUF = 'VERKAUF',
  WAUSGANG = 'WAUSGANG'
}
