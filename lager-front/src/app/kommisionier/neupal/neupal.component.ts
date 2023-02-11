import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PALETTENTYP } from 'src/app/dto/lagerPlatz.dto';
import { NeuePaletteDto } from 'src/app/dto/neuePalette.dto';

@Component({
  selector: 'app-neupal',
  templateUrl: './neupal.component.html',
  styleUrls: ['./neupal.component.scss'],
})
export class NeupalComponent implements OnInit {
  neuPalForm: FormGroup;
  paletetyp = Object.values(PALETTENTYP);
  constructor(
    private dialRef: MatDialogRef<NeupalComponent>,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: NeuePaletteDto,
  ) {
    this.neuPalForm = this.fb.group({
      kommId: [Number],
      palTyp: [PALETTENTYP],
      kommissionierId: [Number],
      gewicht: [Number],
    });
  }
  ngOnInit(): void {
    if (this.data !== undefined && this.data !== null) {
      this.neuPalForm.patchValue(this.data);
    }
  }
  palSpeichern() {
    const tmpData: NeuePaletteDto = new NeuePaletteDto();
    Object.assign(tmpData, this.neuPalForm.value);
    tmpData.kommId = Number(this.neuPalForm.get('kommId')?.getRawValue());
    tmpData.liferant = this.data.liferant;
    this.dialRef.close(tmpData);
  }
  abbruch() {
    this.dialRef.close(null);
  }
}
