import { Pet } from "../models/pet";
import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";

export class PetsService {
    private http = inject(HttpClient);

    getPets(): Observable<Array<Pet>> {
        return this.http.get<Array<Pet>>(`${environment.apiUrl}/pets`);
    }
}