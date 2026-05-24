import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '@shared/components/organisms/str-table/str-table';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { StrSortDirective } from '@shared/directives/str-sort/str-sort.directive';
import { StrSortGroupDirective } from '@shared/directives/str-sort/str-sort-group';
import { SortService } from '@shared/directives/str-sort/str-sort.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmModalComponent, type ConfirmModalData } from '@shared/components/molecules/confirm-modal/confirm-modal.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { StrInputComponent } from '@shared/components/atoms/str-input/str-input.component';
import { StrTooltipDirective } from '@shared/directives/str-tooltip/str-tooltip.directive';
import { UsersTableRowSkeletonComponent } from './users-table-row-skeleton';
import { UserAddModalComponent } from './components/user-add-modal/user-add-modal';
import { UserEditModalComponent } from './components/user-edit-modal/user-edit-modal';
import { UserCartsModalComponent } from './components/user-carts-modal/user-carts-modal';
import { UserService } from '@shared/services/user.service';
import { UserIntegrationService } from '../../services/user-integration/user-integration.service';
import type { User } from '@shared/interfaces/user.interface';

@Component({
  selector: 'app-users-page',
  imports: [
    TableComponent,
    IconComponent,
    StrSortDirective,
    StrSortGroupDirective,
    StrTooltipDirective,
    StrButtonComponent,
    StrInputComponent,
    UsersTableRowSkeletonComponent,
  ],
  providers: [SortService],
  templateUrl: './users.html',
  styleUrl: './users.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);
  private readonly integrationService = inject(UserIntegrationService);

  protected readonly sortService = inject(SortService);

  protected readonly loading = computed(() => this.userService.users.isLoading());
  protected readonly error = computed(() => this.userService.users.error() !== undefined);

  protected readonly filterText = signal('');

  protected readonly filteredUsers = computed(() => {
    const all = this.userService.users.value() ?? [];
    const text = this.filterText().toLowerCase().trim();
    if (!text) return all;
    return all.filter(u =>
      String(u.id).includes(text) ||
      u.username.toLowerCase().includes(text) ||
      u.email.toLowerCase().includes(text) ||
      `${u.name.firstname} ${u.name.lastname}`.toLowerCase().includes(text) ||
      (u.phone ?? '').toLowerCase().includes(text),
    );
  });

  protected readonly users = computed(() => this.sortService.sort(this.filteredUsers()));

  protected readonly hasActiveFilter = computed(() => this.filterText().trim().length > 0);

  protected readonly trackById = (_: number, item: User) => item.id;

  ngOnInit(): void {
    this.userService.users.reload();
  }

  protected openAddModal(): void {
    const ref = this.dialogService.open(UserAddModalComponent, {
      width: '480px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
    });

    ref?.onClose?.subscribe((created) => {
      if (created) this.userService.users.reload();
    });
  }

  protected openEditModal(user: User): void {
    this.dialogService.open(UserEditModalComponent, {
      width: '560px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
      data: user,
    });
  }

  protected openCartsModal(user: User): void {
    this.dialogService.open(UserCartsModalComponent, {
      width: '760px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
      data: user,
    });
  }

  protected openDeleteModal(user: User): void {
    this.dialogService.open(ConfirmModalComponent, {
      width: '420px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
      data: {
        title: 'Excluir usuário',
        description: `Deseja realmente excluir o usuário #${user.id} (${user.username})? Esta ação não poderá ser desfeita.`,
        confirmLabel: 'Excluir',
        loading: this.integrationService.deleteLoading,
        onConfirm: (close) => this.integrationService.delete(user.id, close),
      } satisfies ConfirmModalData,
    });
  }
}
