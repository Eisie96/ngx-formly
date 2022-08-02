import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AppComponent } from './app.component';
import { hideIfEmptyOptionsExtension } from './hide-if-empty-options.extension';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapModule, FormlyModule.forRoot({
    extensions: [{ name: 'hide-if-empty-options-extension', extension: hideIfEmptyOptionsExtension }],
  })],
  declarations: [AppComponent],
})
export class AppModule {}
