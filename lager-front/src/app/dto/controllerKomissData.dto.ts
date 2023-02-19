import { ARTIKELSTATUS } from "./kommissDetails.dto";

export class ControllerKomissDataDto {
  id!: number;
  aid!: number;
  kommissId!: number;
  menge!: number;
  currentGepackt!: number;
  kreditorId!: number;
  gepackt!: ARTIKELSTATUS;
  name!: string;
  gewicht!: number;
  artikelFlage!: string;
  palettennr!: number;
}
