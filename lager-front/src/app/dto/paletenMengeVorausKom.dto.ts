import { ARTIKELFLAGE } from "./artikel.dto";
import { ARTIKELSTATUS } from "./kommissDetails.dto";
import { PALETTENTYP } from "./lagerPlatz.dto";

export class PalettenMengeVorausToDruckDto{
  artikelId!:number;
  name!:string;
  menge!:number;
  gepackt!:ARTIKELSTATUS;
  statlagerplatz!:string;
  paleteTyp!:PALETTENTYP;
  minLosMenge!: number;
  grosse!: string;
  gewicht!:number;
  basisEinheit!:number;
  artikelFlage!: ARTIKELFLAGE;
  proPalete! : number;
}
