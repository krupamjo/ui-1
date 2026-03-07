import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from './pet';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class PetsComponent {

  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  pets = this.route.snapshot.data['pets'] as Pet[];

}

