export class KommissDetailsDto{
  artikelId! : number;
  menge!: number;
  id! : number;
  gepackt! : ARTIKELSTATUS;
  inBestellung!: boolean;
  logisticBelegNr!:string;
}
export enum ARTIKELSTATUS{
  INPACKEN = 'INPACKEN',
  GEPACKT = 'GEPACKT'
}
