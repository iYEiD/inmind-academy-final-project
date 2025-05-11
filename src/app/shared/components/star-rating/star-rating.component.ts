import { Component, Input } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  faStar = faStar;

  get stars(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
