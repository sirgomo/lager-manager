import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DispositorDto } from 'src/app/dto/dispositor.dto';
import GlobalValidators from 'src/app/globalValidators';

@Component({
  selector: 'app-add-debitor',
  templateUrl: './add-debitor.component.html',
  styleUrls: ['./add-debitor.component.scss'],
})
export class AddDebitorComponent implements OnInit {
  formDispositors: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDebitorComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
  ) {
    this.formDispositors = this.fb.group({
      id: Number,
      name: [
        '',
        [Validators.required, Validators.pattern(GlobalValidators.nameReg)],
      ],
      name2: ['', [Validators.pattern(GlobalValidators.nameReg)]],
      stadt: [
        '',
        [Validators.required, Validators.pattern(GlobalValidators.nameReg)],
      ],
      strasseUndNr: [
        '',
        [Validators.required, Validators.pattern(GlobalValidators.strasseReq)],
      ],
      postleitzahl: [
        Number,
        [Validators.required, Validators.pattern(GlobalValidators.postleitReq)],
      ],
      uStIdentifikationsnummer: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    if (
      this.dialogData !== undefined &&
      this.dialogData !== null &&
      this.dialogData.id !== null
    ) {
      this.formDispositors.patchValue(this.dialogData);
    }
  }
  createNewDispo(debi: DispositorDto) {
    console.log(this.formDispositors);
    this.dialogRef.close(debi);
  }
}
