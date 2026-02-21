import { Component, OnInit } from '@angular/core';
import { Pet } from '../models/pet';
import { PetsService } from './pets.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-pets',
	templateUrl: './pets.component.html',
	styleUrls: ['./pets.component.css'],
    imports: [AsyncPipe]
})
export class PetsComponent implements OnInit {
	pets: Array<Pet> = [];

    constructor(private petsService: PetsService) {
        this.petsService = petsService;
    }

    ngOnInit(): void {
        this.getPets$ = this.petsService.getPets();
    }

	getPets$!: Observable<Array<Pet>>;

	addPet(pet: Pet): void {
		this.pets.push(pet);
	}

	remove(index: number): void {
		this.pets.splice(index, 1);
	}
}

