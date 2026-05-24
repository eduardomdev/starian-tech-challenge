import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';
import { StrTooltipDirective } from '@shared/directives/str-tooltip/str-tooltip.directive';
import { ConfirmModalComponent, type ConfirmModalData } from '@shared/components/molecules/confirm-modal/confirm-modal.component';
import { CartsService } from '@shared/services/carts.service';
import { CartsIntegrationService } from '../../../../services/carts-integration/carts-integration.service';
import { CartAddModalComponent } from '../cart-add-modal/cart-add-modal';
import { CartEditModalComponent } from '../cart-edit-modal/cart-edit-modal';
import type { User } from '@shared/interfaces/user.interface';
import type { Cart } from '@shared/interfaces/cart.interface';

@Component({
  selector: 'app-user-carts-modal',
  templateUrl: './user-carts-modal.html',
  styleUrl: './user-carts-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, IconComponent, StrButtonComponent, StrSkeletonComponent, StrTooltipDirective],
  providers: [DialogService],
})
export class UserCartsModalComponent implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  private readonly dialogService = inject(DialogService);
  protected readonly cartsService = inject(CartsService);
  private readonly integrationService = inject(CartsIntegrationService);

  protected readonly ref = inject(DynamicDialogRef);
  protected readonly user = this.config.data as User;

  protected readonly loading = computed(() => this.cartsService.userCarts.isLoading());
  protected readonly error = computed(() => this.cartsService.userCarts.error() !== undefined);
  protected readonly carts = computed(() => this.cartsService.userCarts.value() ?? []);
  protected readonly deleteLoading = this.integrationService.deleteLoading;

  protected readonly userFullName = computed(
    () => `${this.user.name.firstname} ${this.user.name.lastname}`,
  );

  ngOnInit(): void {
    this.cartsService.loadUserCarts(this.user.id);
    this.cartsService.userCarts.reload();
  }

  protected totalItems(cart: Cart): number {
    return cart.products.reduce((sum, p) => sum + p.quantity, 0);
  }

  protected openAddModal(): void {
    const ref = this.dialogService.open(CartAddModalComponent, {
      width: '560px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
      data: { userId: this.user.id },
    });

    ref?.onClose?.subscribe((created) => {
      if (created) this.cartsService.userCarts.reload();
    });
  }

  protected openEditModal(cart: Cart): void {
    const ref = this.dialogService.open(CartEditModalComponent, {
      width: '560px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
      data: cart,
    });

    ref?.onClose?.subscribe((updated) => {
      if (updated) this.cartsService.userCarts.reload();
    });
  }

  protected openDeleteModal(cart: Cart): void {
    this.dialogService.open(ConfirmModalComponent, {
      width: '420px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
      data: {
        title: 'Excluir carrinho',
        description: `Deseja realmente excluir o carrinho #${cart.id}? Esta ação não poderá ser desfeita.`,
        confirmLabel: 'Excluir',
        loading: this.integrationService.deleteLoading,
        onConfirm: (close) =>
          this.integrationService.delete(cart.id, () => {
            this.cartsService.userCarts.reload();
            close();
          }),
      } satisfies ConfirmModalData,
    });
  }

  protected close(): void {
    this.ref.close();
  }
}
