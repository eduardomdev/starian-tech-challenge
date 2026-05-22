import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { ProductsIntegrationService } from '../../../../services/products-integration.service';
import type { Product } from '@shared/interfaces/products.interface';

@Component({
  selector: 'app-product-delete-modal',
  templateUrl: './product-delete-modal.html',
  styleUrl: './product-delete-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StrButtonComponent],
})
export class ProductDeleteModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly integrationService = inject(ProductsIntegrationService);

  protected readonly product = this.config.data as Product;
  protected readonly deleteLoading = this.integrationService.deleteLoading;

  protected confirm(): void {
    this.integrationService.delete(this.product.id, () => this.ref.close(this.product));
  }

  protected cancel(): void {
    this.ref.close();
  }
}
