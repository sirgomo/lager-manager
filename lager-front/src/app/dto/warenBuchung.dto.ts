export class WarenBuchungDto{

  id! : number
  artikelid! : number;
  menge! : number;
  tor! : string;
  kreditorId!: number;
  eingebucht! : boolean;
  bestellungId! : number;
  artikelsGebucht!: boolean;
    lieferscheinNr!:string;
    empfangDatum!: Date;
    priceNetto!: number;
    mehrwertsteuer!:number;

}
