import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Pet } from './pet';
import { PetsService } from './pets.service';

export const petsResolver: ResolveFn<Pet[]> = () => {
	return inject(PetsService).getPets();
};
