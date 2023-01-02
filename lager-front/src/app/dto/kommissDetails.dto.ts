export class KommissDetailsDto {
  artikelId!: number;
  menge!: number;
  rabatt!: number;
  id!: number;
  gepackt!: ARTIKELSTATUS;
  inBestellung!: boolean;
  kreditorId!: number;
  logisticBelegNr!: string;
}
export enum ARTIKELSTATUS {
  INPACKEN = 'INPACKEN',
  GEPACKT = 'GEPACKT',
  TEILGEPACKT = 'TEILGEPACKT',
}
