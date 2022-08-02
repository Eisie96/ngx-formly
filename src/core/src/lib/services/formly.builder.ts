import { Injectable, Injector, Optional, ViewContainerRef } from '@angular/core';
import { FormGroup, FormArray, FormGroupDirective } from '@angular/forms';
import { FormlyConfig } from './formly.config';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache, FormlyFieldProps } from '../models';
import { defineHiddenProp, observe, disableTreeValidityCall } from '../utils';

@Injectable({ providedIn: 'root' })
export class FormlyFormBuilder {
  constructor(
    private config: FormlyConfig,
    private injector: Injector,
    @Optional() private viewContainerRef: ViewContainerRef,
    @Optional() private parentForm: FormGroupDirective,
  ) {}

  buildForm(form: FormGroup | FormArray, fieldGroup: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    this.build({ fieldGroup, model, form, options });
  }

  build(field: FormlyFieldConfig) {
    if (!this.config.extensions.core) {
      throw new Error('NgxFormly: missing `forRoot()` call. use `forRoot()` when registering the `FormlyModule`.');
    }

    if (!field.parent) {
      this._setOptions(field);
      disableTreeValidityCall(field.form, () => {
        this._build(field);
        const options = (field as FormlyFieldConfigCache).options;
        options.checkExpressions?.(field, true);
        options.detectChanges?.(field);
      });
    } else {
      this._build(field);
    }
  }

  private _build(field: FormlyFieldConfigCache) {
    if (!field) {
      return;
    }

    const extensions = Object.values(this.config.extensions);

    const extensionCallback = (callbackName: 'prePopulate' | 'onPopulate' | 'postPopulate'): FormlyFieldConfigCache => {
      return extensions.reduce((prev, curr) => {
        const result = curr[callbackName]?.(prev);
        return result ? result : prev;
      }, field);
    };

    field = extensionCallback('prePopulate');
    field = extensionCallback('onPopulate');
    field.fieldGroup?.forEach((f) => this._build(f));
    field = extensionCallback('postPopulate');
  }

  private _setOptions(field: FormlyFieldConfigCache) {
    field.form = field.form || new FormGroup({});
    field.model = field.model || {};
    field.options = field.options || {};
    const options = field.options;

    if (!options._viewContainerRef) {
      defineHiddenProp(options, '_viewContainerRef', this.viewContainerRef);
    }

    if (!options._injector) {
      defineHiddenProp(options, '_injector', this.injector);
    }

    if (!options.build) {
      options._buildForm = () => {
        console.warn(`Formly: 'options._buildForm' is deprecated since v6.0, use 'options.build' instead.`);
        this.build(field);
      };

      options.build = (f: FormlyFieldConfig = field) => {
        this.build(f);

        return f;
      };
    }

    if (!options.parentForm && this.parentForm) {
      defineHiddenProp(options, 'parentForm', this.parentForm);
      observe(options, ['parentForm', 'submitted'], ({ firstChange }) => {
        if (!firstChange) {
          options.checkExpressions(field);
          options.detectChanges(field);
        }
      });
    }
  }
}
