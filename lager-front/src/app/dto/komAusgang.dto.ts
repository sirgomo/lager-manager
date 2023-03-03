import { KOMMISIONSTATUS } from "./komiss.dto";
import { PALETTENTYP } from "./lagerPlatz.dto";

export class KomAusgangDto {
    art_basisEinheit!: number;
    art_gewicht!: number;
    art_mehrwertsteuer!: number;
    art_minLosMenge!: number;
    buchungsDatum!: Date;
    dispositorId!:number;
    falligkeitDatum!: Date;
    gewunschtesLieferDatum!: Date;
    id!: number;
    kommissStatus!: KOMMISIONSTATUS;
    maxPalettenHoher!: number;
    rausDatum!: Date;
    skonto!: number;
    skontoFrist!: number;
    spedition!: number;
    verkauferId!: number;
    versorgungId!: string;
    komd_artikelId!: number;
    komd_id!: number;
    komd_kreditorId!: number;
    komd_menge!: number;
    komd_palettennr!: number;
    lkwNummer!: number;
    paletteRealGewicht!: number;
    palettenTyp!: PALETTENTYP;
    kommDetails!: any[];
}