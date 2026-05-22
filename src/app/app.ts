import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrComponent } from './shared/components/atoms/toastr/toastr.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastrComponent],
  template: `
    <router-outlet />
    <str-toastr />
  `,
  styleUrl: './app.scss',
})
export class App {}
