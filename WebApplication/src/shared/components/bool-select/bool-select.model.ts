export class BoolSelectModel {
  id: number;
  name: string;
  value: boolean;

  constructor(id: number, name: string, value: boolean) {
    this.id = id;
    this.name = name;
    this.value = value;
  }
}