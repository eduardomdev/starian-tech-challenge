import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { StrInputComponent } from '@shared/components/atoms/inputs/str-input/str-input.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { StrQuantityToggleComponent } from '@shared/components/atoms/str-quantity-toggle/str-quantity-toggle.component';
import type { Product } from '@shared/interfaces/products.interface';
import type { SelectedItem } from '../../../../services/cart-form/cart-form.service';

@Component({
  selector: 'app-cart-products-panel',
  templateUrl: './cart-products-panel.html',
  styleUrl: './cart-products-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StrInputComponent, StrButtonComponent, IconComponent, StrQuantityToggleComponent, DecimalPipe],
})
export class CartProductsPanelComponent {
  readonly productsLoading = input.required<boolean>();
  readonly productsError = input.required<boolean>();
  readonly filteredProducts = input.required<Product[]>();
  readonly selectedItems = input.required<SelectedItem[]>();
  readonly allProducts = input.required<Product[]>();
  readonly searchQuery = input.required<string>();
  readonly searchInputId = input<string>('cart-search');

  readonly searchQueryChange = output<string>();
  readonly addProduct = output<Product>();
  readonly removeProduct = output<number>();
  readonly increaseQuantity = output<number>();
  readonly decreaseQuantity = output<number>();
}
