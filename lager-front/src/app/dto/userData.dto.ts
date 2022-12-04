export class UserDataDto{
  id!: number;
  vorname!:string;
  nachname!:string;
  username!: string;
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
