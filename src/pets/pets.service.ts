import { Injectable, inject } from '@angular/core';
import { Pet } from './pet';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  
  http = inject(HttpClient);
  apiUrl = `${environment.apiUrl}/pets`;

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl);
  }

  getPetById(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }

  addPet(pet: Omit<Pet, 'id'>): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, pet);
  }

  updatePet(id: string, pet: Partial<Pet>): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/${id}`, pet);
  }

  removePet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}