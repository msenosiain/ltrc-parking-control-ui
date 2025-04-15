import {Component, Inject, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';

@Component({
  selector: 'ltrc-member-item',
  imports: [MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, NgxMaskDirective,
  ],
  templateUrl: './member-item.component.html',
  styleUrl: './member-item.component.scss',
  providers: [provideNgxMask()]
})
export class MemberItemComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      lastName: [this.data?.lastName || '', Validators.required],
      dni: [this.data?.dni ?? '', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value); // Devuelve el member al componente padre
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
