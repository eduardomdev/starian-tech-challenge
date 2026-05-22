import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { BreadcrumbItem } from '../../../interfaces/breadcrumb.interface';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private router = inject(Router);

  readonly breadcrumb = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.resolveFromSnapshot(this.router.routerState.snapshot.root)),
    ),
    { initialValue: [] as BreadcrumbItem[] },
  );

  private resolveFromSnapshot(snapshot: ActivatedRouteSnapshot): BreadcrumbItem[] {
    return snapshot.firstChild ? this.resolveFromSnapshot(snapshot.firstChild) : snapshot.data['breadcrumb'] ?? [];
  }
}
