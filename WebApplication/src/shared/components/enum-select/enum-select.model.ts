export class EnumSelect {
    name: string;
    value: number;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = +value;
    }
}