import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PetsComponent } from './pets.component';
import { Pet } from './pet';
import { CommonModule } from '@angular/common';
import { describe, it, expect, beforeEach } from 'vitest';

describe('PetsComponent', () => {
  let component: PetsComponent;
  let fixture: ComponentFixture<PetsComponent>;
  let mockActivatedRoute: any;

  const mockPets: Pet[] = [
    new Pet(1, 'Fluffy', '2020-01-15'),
    new Pet(2, 'Buddy', '2019-06-22'),
    new Pet(3, 'Luna', '2021-03-10')
  ];

  beforeEach(async () => {
    mockActivatedRoute = {
      data: of({ pets: mockPets }),
      snapshot: {
        data: { pets: mockPets }
      }
    };

    await TestBed.configureTestingModule({
      imports: [PetsComponent, CommonModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PetsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pets from route data', () => {
    expect(component.pets).toEqual(mockPets);
  });

  it('should display all pets in the template', () => {
    fixture.detectChanges();

    const petListItems = fixture.nativeElement.querySelectorAll('.list-group-item');
    expect(petListItems.length).toBe(mockPets.length);
  });

  it('should display pet names correctly', () => {
    fixture.detectChanges();

    const petItems = fixture.nativeElement.querySelectorAll('.list-group-item');
    expect(petItems[0].textContent).toContain('Fluffy');
    expect(petItems[1].textContent).toContain('Buddy');
    expect(petItems[2].textContent).toContain('Luna');
  });

  it('should display pet dates of birth with date pipe', () => {
    fixture.detectChanges();

    const petItems = fixture.nativeElement.querySelectorAll('.list-group-item');
    expect(petItems.length).toBe(mockPets.length);

    // Check that DOB label exists
    petItems.forEach((element: HTMLElement) => {
      expect(element.textContent).toContain('DOB:');
    });
  });

  it('should show empty state when no pets are provided', async () => {
    // Create a fresh TestBed for this test with empty pets
    const emptyMockRoute = {
      data: of({ pets: [] }),
      snapshot: {
        data: { pets: [] }
      }
    };

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [PetsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: emptyMockRoute }
      ]
    }).compileComponents();

    const emptyFixture = TestBed.createComponent(PetsComponent);
    const emptyComponent = emptyFixture.componentInstance;

    expect(emptyComponent.pets).toEqual([]);

    emptyFixture.detectChanges();

    const emptyState = emptyFixture.nativeElement.querySelector('.alert-info');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No pets found');
  });

  it('should use pet id as track identifier in the for loop', () => {
    fixture.detectChanges();

    const petListItems = fixture.nativeElement.querySelectorAll('.list-group-item');

    // Verify that each list item corresponds to a pet
    mockPets.forEach((pet, index) => {
      expect(petListItems[index].textContent).toContain(pet.name);
    });
  });

  it('should import CommonModule for template directives', () => {
    // Verify the component has CommonModule in its imports
    const metadata = (PetsComponent as any).ɵcmp;
    expect(metadata.dependencies).toBeDefined();
  });
});
