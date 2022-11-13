export class KommissDetailsDto{
  artikelId! : number;
  menge!: number;
  id! : number;
  gepackt! : ARTIKELSTATUS;
}
export enum ARTIKELSTATUS{
  INPACKEN = 'INPACKEN',
  GEPACKT = 'GEPACKT'
}
