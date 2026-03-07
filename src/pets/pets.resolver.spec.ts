import { TestBed } from '@angular/core/testing';
import { petsResolver } from './pets.resolver';
import { PetsService } from './pets.service';
import { Pet } from './pet';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('petsResolver', () => {
  let petsService: PetsService;

  const mockPets: Pet[] = [
    new Pet(1, 'Fluffy', '2020-01-15'),
    new Pet(2, 'Buddy', '2019-06-22'),
  ];

  beforeEach(() => {
    const mockPetsService = {
      getPets: vi.fn().mockReturnValue(of(mockPets)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: PetsService, useValue: mockPetsService }],
    });

    petsService = TestBed.inject(PetsService);
  });

  it('should resolve pets by calling PetsService.getPets', async () => {
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = { url: '/pets' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => petsResolver(mockRoute, mockState)) as any;

    const pets = await new Promise<Pet[]>((resolve) => {
      if (result.subscribe) {
        result.subscribe((p: Pet[]) => resolve(p));
      } else if (result.then) {
        result.then((p: Pet[]) => resolve(p));
      } else {
        resolve(result as Pet[]);
      }
    });

    expect(pets).toEqual(mockPets);
    expect(petsService.getPets).toHaveBeenCalled();
  });

  it('should resolve with empty array if no pets', async () => {
    const emptyMockPetsService = {
      getPets: vi.fn().mockReturnValue(of([])),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PetsService, useValue: emptyMockPetsService }],
    });

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = { url: '/pets' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => petsResolver(mockRoute, mockState)) as any;

    const pets = await new Promise<Pet[]>((resolve) => {
      if (result.subscribe) {
        result.subscribe((p: Pet[]) => resolve(p));
      } else if (result.then) {
        result.then((p: Pet[]) => resolve(p));
      } else {
        resolve(result as Pet[]);
      }
    });

    expect(pets).toEqual([]);
  });
});
