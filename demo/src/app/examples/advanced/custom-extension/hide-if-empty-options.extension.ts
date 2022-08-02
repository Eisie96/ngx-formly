import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { isObservable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Extension that automatically hides select fields when their options are empty.
 *
 * @templateOption **options** - array or observable of arrays that will be checked for emptiness
 */
export const hideIfEmptyOptionsExtension: FormlyExtension = {
  prePopulate(field: FormlyFieldConfig): void | FormlyFieldConfig {
    if (field.type !== 'select') {
      return;
    }

    return {
      ...field,
      expressions: {
        ...field.expressions,
        hide: (isObservable(field.props.options) ? field.props.options : of(field.props.options)).pipe(
          map((options) => options?.length === 0),
        ),
      },
    };
  },
};
