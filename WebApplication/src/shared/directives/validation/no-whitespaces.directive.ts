import { Directive, Input, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

export function NoWhitespacesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const isWhitespace = (control.value || '').trim().length === 0;
        return !isWhitespace ? null : { whitespace: 'value is only whitespace' };
    };
}

@Directive({
    standalone: true,
    selector: '[noWhiteSpacesValidation]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NoWhitespacesDirective),
            multi: true
        }
    ]
})

export class NoWhitespacesDirective implements Validator {

    @Input() enableEmptyValidation = false;

    private valFn = NoWhitespacesValidator();
    validate(control: AbstractControl): { [key: string]: any } | null {
        if (!this.enableEmptyValidation) {
            return this.valFn(control);
        } else {
            return control.value ? this.valFn(control) : null;
        }
    }
}
