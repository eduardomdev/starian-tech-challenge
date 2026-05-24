import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	TemplateRef,
	ViewEncapsulation,
	computed,
	contentChild,
	input,
	model,
} from '@angular/core';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';
export type { TableRowContext } from '@shared/interfaces/str-table.interface';
import type { TableRowContext } from '@shared/interfaces/str-table.interface';

@Component({
	selector: 'str-table',
	imports: [NgTemplateOutlet, StrSkeletonComponent],
	templateUrl: './str-table.html',
	styleUrl: './str-table.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[attr.aria-busy]': 'loading()',
	},
})
export class TableComponent<T> {
	readonly data = input.required<T[]>();
	readonly loading = model(false);
	readonly errorLoading = input(false);
	readonly emptyText = input('Nenhum dado disponível no momento');
	readonly caption = input<string>();
	readonly skeletonRowCount = input<number>(6);
	readonly trackByFn = input<(index: number, item: T) => unknown>((index) => index);

	readonly headerTemplate = contentChild.required<unknown, TemplateRef<void>>('headerTemplate', { read: TemplateRef });
	readonly itemTemplate = contentChild.required<unknown, TemplateRef<TableRowContext<T>>>('itemTemplate', { read: TemplateRef });
	readonly skeletonTemplate = contentChild<unknown, TemplateRef<void>>('skeletonTemplate', { read: TemplateRef });
	readonly emptyDataTemplate = contentChild<unknown, TemplateRef<void>>('emptyDataTemplate', { read: TemplateRef });
	readonly errorTemplate = contentChild<unknown, TemplateRef<void>>('errorTemplate', { read: TemplateRef });
	readonly toolbarTemplate = contentChild<unknown, TemplateRef<void>>('toolbarTemplate', { read: TemplateRef });

	protected readonly skeletonRows = computed(() => Array.from({ length: this.skeletonRowCount() }, (_, i) => i) );
}
