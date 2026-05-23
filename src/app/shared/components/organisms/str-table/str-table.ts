import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	TemplateRef,
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
	host: {
		'[attr.aria-busy]': 'loading()',
	},
})
export class TableComponent<T> {
	public data = input.required<T[]>();
	public loading = model(false);
	public errorLoading = input(false);
	public emptyText = input('Nenhum dado disponível no momento');
	public caption = input<string>();
	public skeletonRowCount = input<number>(6);
	public trackByFn = input<(index: number, item: T) => unknown>((index) => index);

	public headerTemplate = contentChild.required<unknown, TemplateRef<void>>('headerTemplate', { read: TemplateRef });
	public itemTemplate = contentChild.required<unknown, TemplateRef<TableRowContext<T>>>('itemTemplate', { read: TemplateRef });
	public skeletonTemplate = contentChild<unknown, TemplateRef<void>>('skeletonTemplate', { read: TemplateRef });
	public emptyDataTemplate = contentChild<unknown, TemplateRef<void>>('emptyDataTemplate', { read: TemplateRef });
	public errorTemplate = contentChild<unknown, TemplateRef<void>>('errorTemplate', { read: TemplateRef });
	public toolbarTemplate = contentChild<unknown, TemplateRef<void>>('toolbarTemplate', { read: TemplateRef });

	protected readonly skeletonRows = computed(() => Array.from({ length: this.skeletonRowCount() }, (_, i) => i) );
}
