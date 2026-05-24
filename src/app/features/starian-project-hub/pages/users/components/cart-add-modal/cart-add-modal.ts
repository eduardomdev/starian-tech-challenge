import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { StrInputComponent } from '@shared/components/atoms/inputs/str-input/str-input.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';
import { CartsIntegrationService } from '../../../../services/carts-integration/carts-integration.service';
import { CartFormService } from '../../../../services/cart-form/cart-form.service';
import { StrQuantityToggleComponent } from '@shared/components/atoms/str-quantity-toggle/str-quantity-toggle.component';

interface CartAddConfig {
  userId: number;
}

@Component({
  selector: 'app-cart-add-modal',
  templateUrl: './cart-add-modal.html',
  styleUrl: './cart-add-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartFormService],
  imports: [StrInputComponent, StrButtonComponent, IconComponent, StrSkeletonComponent, DecimalPipe, StrQuantityToggleComponent],
})
export class CartAddModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly integrationService = inject(CartsIntegrationService);

  protected readonly form = inject(CartFormService);

  protected readonly addLoading = this.integrationService.addLoading;
  private readonly userId = (this.config.data as CartAddConfig).userId;

  protected submit(): void {
    if (!this.form.isValid()) return;

    this.integrationService.add(
      { userId: this.userId, products: this.form.buildProductsPayload() },
      (created) => this.ref.close(created),
    );
  }

  protected cancel(): void {
    this.ref.close();
  }
}
