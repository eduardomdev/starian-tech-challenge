import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, required } from '@angular/forms/signals';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { StrInputComponent } from '@shared/components/atoms/str-input/str-input.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { StrSelectComponent } from '@shared/components/atoms/str-select/str-select.component';
import { PRODUCT_CATEGORIES } from '@core/constants/product-categories.constant';
import { ProductsIntegrationService } from '../../../../services/products-integration.service';

interface ProductAddModel {
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-product-add-modal',
  templateUrl: './product-add-modal.html',
  styleUrl: './product-add-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, FormField, StrInputComponent, StrButtonComponent, StrSelectComponent],
})
export class ProductAddModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly integrationService = inject(ProductsIntegrationService);

  protected readonly addLoading = this.integrationService.addLoading;
  protected readonly categoryOptions = signal(PRODUCT_CATEGORIES);

  protected readonly addModel = signal<ProductAddModel>({
    title: '',
    price: '',
    category: '',
    description: '',
    image: '',
  });

  protected readonly addForm = form(
    this.addModel,
    (p) => {
      required(p.title, { message: 'Título é obrigatório.' });
      maxLength(p.title, 150, { message: 'Título pode ter no máximo 150 caracteres.' });
      required(p.price, { message: 'Preço é obrigatório.' });
      maxLength(p.price, 15, { message: 'Preço pode ter no máximo 15 caracteres.' });
      required(p.category, { message: 'Categoria é obrigatória.' });
      required(p.description, { message: 'Descrição é obrigatória.' });
      required(p.image, { message: 'URL da imagem é obrigatória.' });
    },
    {
      submission: {
        action: async (f) => {
          const { title, price, category, description, image } = f().value();
          this.integrationService.add(
            { title, price: Number(price), category, description, image, rating: { rate: 0, count: 0 } },
            (created) => this.ref.close(created),
          );
        },
      },
    },
  );

  protected cancel(): void {
    this.ref.close();
  }
}
