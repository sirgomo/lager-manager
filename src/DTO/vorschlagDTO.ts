import { IsNotEmpty, MinLength } from "class-validator";

export class VorschalgDTO {
    @IsNotEmpty({message: 'Vorschlag kann nicht empty werden!'})
    vorschlag: string;
    @IsNotEmpty({message: 'Danke für vorschlag aber du musst auch Name geben'})
    @MinLength(3)
    name: string;
}