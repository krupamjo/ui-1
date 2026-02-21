export class Pet {
    id: number;
    name: string;
    dateOfBirth: Date;
    
    constructor(id: number, name: string, dateOfBirth: Date) {
        this.id = id;
        this.name = name;
        this.dateOfBirth = dateOfBirth;
    }
}