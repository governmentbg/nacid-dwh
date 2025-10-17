import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

    transform(value: any): string {
        if (value) {
            let integerPart: string = value.toString();

            let firstSlice = true;
            const arrayResults: Array<string> = [];
            let finalResult = '';

            const divisor = 3;
            const dividend: number = integerPart.length;
            let remainder = dividend % divisor;
            let quotient = (dividend + remainder) / divisor;

            if (dividend >= 3) {
                do {
                    if (firstSlice && remainder > 0) {
                        firstSlice = false;
                        arrayResults.push(integerPart.slice(0, remainder));
                    } else {
                        firstSlice = false;
                        arrayResults.push(integerPart.slice(remainder, remainder + divisor));
                        remainder = remainder + divisor;
                        quotient--;
                    }
                } while (quotient >= 1);

                arrayResults.forEach(part => {
                    finalResult += `${part} `;
                });

                return finalResult.trim();

            } else {
                return value;
            }
        }
        return value;
    }
}