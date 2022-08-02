import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor() {
    this.fields = [{
      type: 'select',
      key: 'color',
      props: {
        options: [{ label: 'Red', value: 'red'}, { label: 'Blue', value: 'blue' }, { label: 'Green', value: 'green' }]
      }
    }, {
      type: 'select',
      key: 'shape',
      props: {
        options: []
      }
    }]
  }

  submit() {
    alert(JSON.stringify(this.model));
  }
}
