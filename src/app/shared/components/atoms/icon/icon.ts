import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
	selector: 'str-icon',
	imports: [NgClass],
	template: `
    <span
      class="material-symbols-rounded icon-container"
      [ngClass]="{ 'fill-mode': fill(), 'rotate-icon': rotate() }"
      [style.fontSize]="iconSize()"
      [style.color]="colorIcon()"
    >
      {{ name() }}
    </span>
  `,
	styles: `
    :host {
      display: flex;
    }
    .rotate-icon {
      transform: rotate(180deg);
      transition: 320ms;
    }
    .icon-container {
      transition: 320ms;
    }
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
	public fill = input<boolean>(false);
	public name = input<string>();
	public colorIcon = input<string>();
	public size = input<'6' | '12' | '16' | '18' | '20' | '24' | '28'>('24');
	public iconUrl = input<string>();
	public rotate = input<boolean>(false);

	protected iconSize = computed(() => {
		return `${this.size()}px` ;
	});
}