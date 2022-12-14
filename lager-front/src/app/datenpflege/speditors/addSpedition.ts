import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpeditionDto } from 'src/app/dto/spedition.dto';
import GlobalValidators from 'src/app/globalValidators';

@Component({
  selector: 'app-add',
  templateUrl: './addSpedition.html',
  styleUrls: ['./addSpedition.scss']
})
export class AddSpedition {
  formSpedition : FormGroup;
  constructor(private fb: FormBuilder, @Optional() @Inject(MAT_DIALOG_DATA) private data : SpeditionDto, private dialRef : MatDialogRef<AddSpedition>){
    this.formSpedition = this.fb.group({
      id: Number,
      name: ['', [Validators.required, Validators.pattern(GlobalValidators.nameReg)]],
      name2: ['', [Validators.pattern(GlobalValidators.nameReg)]],
      maxLadeGewicht: Number,
      maxPalettenMenge: Number,
      stadt: ['', [Validators.required, Validators.pattern(GlobalValidators.nameReg)]],
      strasseUndNr: ['', [Validators.required, Validators.pattern(GlobalValidators.strasseReq)]],
      postleitzahl: ['', [Validators.required, Validators.pattern(GlobalValidators.postleitReq)]],
      uStIdentifikationsnummer:['', [Validators.required, Validators.pattern(GlobalValidators.ustnrReq)]],
    });
    if(this.data !== null){
      this.formSpedition.patchValue(data);
    }
  }
  closeDialog(data : SpeditionDto){
    this.dialRef.close(data);
  }
}
