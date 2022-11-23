import { ARTIKELFLAGE } from "src/entity/ArtikelEntity";
import { ARTIKELSTATUS } from "src/entity/KommisioDetailsEntity";
import { PALETTENTYP } from "src/entity/LagerPlatzEntity";

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
}