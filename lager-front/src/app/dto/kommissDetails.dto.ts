export class KommissDetailsDto{
  artikelId! : number;
  menge!: number;
  id! : number;
  gepackt! : ARTIKELSTATUS;
  inBestellung!: boolean;
}
export enum ARTIKELSTATUS{
  INPACKEN = 'INPACKEN',
  GEPACKT = 'GEPACKT'
}
