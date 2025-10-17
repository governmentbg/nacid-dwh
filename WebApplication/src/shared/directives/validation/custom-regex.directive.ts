import { Directive, forwardRef, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from "@angular/forms";

export function CustomRegexValidator(patternName?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    if (patternName) {
      const isWhitespace = (control.value || '').trim().length === 0;
      if (isWhitespace) {
        return { whitespace: 'value is only whitespace' };
      } else {
        const pattern = patterns[patternName];
        return pattern && pattern.test(control.value) ? null : { error: errors[patternName] }
      }
    } else {
      return null;
    }
  };
}

@Directive({
  standalone: true,
  selector: '[customRegexValidation]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomRegexDirective),
      multi: true
    }
  ]
})

export class CustomRegexDirective implements Validator {

  @Input() enableEmptyValidation = false;
  @Input() customRegexValidation: string = null;

  private valFn = CustomRegexValidator();
  validate(control: AbstractControl): { [key: string]: any } | null {
    this.valFn = CustomRegexValidator(this.customRegexValidation);
    if (!this.enableEmptyValidation) {
      return this.valFn(control);
    } else {
      return control.value ? this.valFn(control) : null;
    }
  }
}

const patterns: { [key: string]: any } = {
  addressCyrillic: /^[\u0400-\u04FF0-9-VIX№."\s]+$/,
  addressLatin: /^[A-Za-z0-9-№#.„“"\s]+$/,
  namesCyrillic: /^[\u0400-\u04FF\'-\s]+$/,
  namesLatin: /^[A-Za-z-\'\s]+$/,
  nonCyrillic: /^[^\u0400-\u04FF]+$/,
  nonLatin: /^[^A-Za-z]+$/
}

const errors: { [key: string]: any } = {
  addressCyrillic: 'value is not cyrillic',
  addressLatin: 'value is not latin',
  namesCyrillic: 'value is not cyrillic',
  namesLatin: 'value is not latin',
  nonCyrillic: 'value contains cyrillic',
  nonLatin: 'value contains latin'
}
