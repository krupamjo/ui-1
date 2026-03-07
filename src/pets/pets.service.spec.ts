import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PetsService } from './pets.service';
import { Pet } from './pet';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('PetsService', () => {
  let service: PetsService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://krupamjo-api.azurewebsites.net/pets';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PetsService, provideHttpClientTesting()],
    });
    service = TestBed.inject(PetsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getPets', () => {
    it('should fetch all pets', () => new Promise<void>(resolve => {
      const mockPets: Pet[] = [
        new Pet(1, 'Buddy', '2020-01-15'),
        new Pet(2, 'Max', '2019-06-20')
      ];

      service.getPets().subscribe((pets) => {
        expect(pets.length).toBe(2);
        expect(pets).toEqual(mockPets);
        resolve();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPets);
    }));

    it('should handle empty pets list', () => new Promise<void>(resolve => {
      service.getPets().subscribe((pets) => {
        expect(pets.length).toBe(0);
        expect(pets).toEqual([]);
        resolve();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);
    }));
  });

  describe('getPetById', () => {
    it('should fetch a pet by ID', () => new Promise<void>(resolve => {
      const mockPet: Pet = new Pet(1, 'Buddy', '2020-01-15');

      service.getPetById('1').subscribe((pet) => {
        expect(pet).toEqual(mockPet);
        resolve();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPet);
    }));
  });

  describe('addPet', () => {
    it('should add a new pet', () => new Promise<void>(resolve => {
      const newPet: Omit<Pet, 'id'> = { name: 'Buddy', dateOfBirth: '2020-01-15' } as any;
      const mockResponse: Pet = new Pet(1, 'Buddy', '2020-01-15');

      service.addPet(newPet).subscribe((pet) => {
        expect(pet).toEqual(mockResponse);
        resolve();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.name).toBe('Buddy');
      req.flush(mockResponse);
    }));
  });

  describe('updatePet', () => {
    it('should update an existing pet', () => new Promise<void>(resolve => {
      const updates = { name: 'Buddy Updated' };
      const mockResponse: Pet = new Pet(1, 'Buddy Updated', '2020-01-15');

      service.updatePet('1', updates).subscribe((pet) => {
        expect(pet).toEqual(mockResponse);
        resolve();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      req.flush(mockResponse);
    }));
  });

  describe('removePet', () => {
    it('should delete a pet', () => new Promise<void>(resolve => {
      service.removePet('1').subscribe(() => {
        resolve();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    }));
  });
});
