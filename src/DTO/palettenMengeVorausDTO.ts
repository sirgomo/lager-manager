import { ARTIKELFLAGE } from "src/entity/artikelEntity";
import { ARTIKELSTATUS } from "src/entity/kommisioDetailsEntity";
import { PALETTENTYP } from "src/entity/lagerPlatzEntity";

export class PalettenMengeVorausDTO{
    artikelId:number; 
    name:string;
    menge:number;
    gepackt:ARTIKELSTATUS;
    statlagerplatz:string;
    paleteTyp:PALETTENTYP;
    minLosMenge: number;
    grosse: string;
    gewicht:number;
    basisEinheit:number;
    artikelFlage: ARTIKELFLAGE;
    proPalete : number;  
}