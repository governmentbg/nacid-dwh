import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    standalone: true,
    name: 'nomenclaturePipe'
})
export class NomenclaturePipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }

    transform(item: any, textTemplate: string | null, textFilter?: string | null): any {
        let resultText: string;
        if (textTemplate && item) {
            resultText = textTemplate;
            while (resultText.includes('{') && resultText.includes('}')) {
                const propertyInterpolation = resultText.substring(resultText.lastIndexOf('{') + 1, resultText.lastIndexOf('}'));
                const innerProperties = propertyInterpolation.split('.');
                let currentProperty = item;
                innerProperties.forEach((key: string) => {
                    if (currentProperty) {
                        currentProperty = currentProperty[key];
                    }
                });

                resultText = resultText.replace(`{${propertyInterpolation}}`, currentProperty != null ? currentProperty : "");
            }
        } else if (item) {
            if (item.name && item.name.includes('<') && item.name.includes('>')) {
                item.name = item.name.replace('<', '&lt').replace('>', '&gt');
            }
            resultText = item.name;
        } else {
            resultText = '';
        }

        if (textFilter) {
            textFilter = textFilter.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            resultText = resultText.replace(new RegExp(textFilter, 'gi'), '<span style="text-decoration: underline; font-weight: bolder;">$&</span>');
        }

        resultText = resultText.replace('#asc', '').replace('#desc', '');
        return this.sanitized.bypassSecurityTrustHtml(resultText);
    }
}
