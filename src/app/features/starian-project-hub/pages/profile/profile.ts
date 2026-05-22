import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {}
