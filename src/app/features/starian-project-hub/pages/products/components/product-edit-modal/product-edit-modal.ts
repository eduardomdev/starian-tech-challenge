import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, required } from '@angular/forms/signals';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StrInputComponent } from '@shared/components/atoms/inputs/str-input/str-input.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { StrSelectComponent } from '@shared/components/atoms/inputs/str-select/str-select.component';
import { PRODUCT_CATEGORIES } from '@core/constants/product-categories.constant';
import { ProductsIntegrationService } from '../../../../services/products-integration/products-integration.service';
import type { Product } from '@shared/interfaces/products.interface';

interface ProductEditModel {
  title: string;
  price: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-product-edit-modal',
  templateUrl: './product-edit-modal.html',
  styleUrl: './product-edit-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, FormField, StrInputComponent, StrButtonComponent, StrSelectComponent],
})
export class ProductEditModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly integrationService = inject(ProductsIntegrationService);

  protected readonly product = this.config.data as Product;
  protected readonly updateLoading = this.integrationService.updateLoading;
  protected readonly categoryOptions = signal(PRODUCT_CATEGORIES);

  protected readonly editModel = signal<ProductEditModel>({
    title: this.product.title,
    price: String(this.product.price),
    category: this.product.category,
    description: this.product.description,
  });

  protected readonly editForm = form(
    this.editModel,
    (p) => {
      required(p.title, { message: 'Título é obrigatório.' });
      maxLength(p.title, 150, { message: 'Título pode ter no máximo 150 caracteres.' });
      required(p.price, { message: 'Preço é obrigatório.' });
      maxLength(p.price, 15, { message: 'Preço pode ter no máximo 15 caracteres.' });
      required(p.category, { message: 'Categoria é obrigatória.' });
      required(p.description, { message: 'Descrição é obrigatória.' });
    },
    {
      submission: {
        action: async (f) => {
          const { title, price, category, description } = f().value();
          const payload: Product = {
            ...this.product,
            title,
            price: Number(price),
            category,
            description,
          };

          this.integrationService.update(payload, (updated) => this.ref.close(updated));
        },
      },
    },
  );

  protected cancel(): void {
    this.ref.close();
  }
}
