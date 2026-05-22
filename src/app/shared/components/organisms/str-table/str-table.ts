import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	TemplateRef,
	contentChild,
	input,
	model,
} from '@angular/core';
import { LoadingMoleculeComponent } from '../../molecules/str-loading/str-loading';
export type { TableRowContext } from '@shared/interfaces/str-table.interface';
import type { TableRowContext } from '@shared/interfaces/str-table.interface';

@Component({
	selector: 'str-table',
	imports: [NgTemplateOutlet, LoadingMoleculeComponent],
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
	public textLoading = input('Carregando dados...');
	public errorLoading = input(false);
	public emptyText = input('Nenhum dado disponível no momento');
	public caption = input<string>();
	public trackByFn = input<(index: number, item: T) => unknown>((index) => index);
	
	public headerTemplate = contentChild.required<unknown, TemplateRef<void>>('headerTemplate', { read: TemplateRef });
	public itemTemplate = contentChild.required<unknown, TemplateRef<TableRowContext<T>>>('itemTemplate', { read: TemplateRef });
	public emptyDataTemplate = contentChild<unknown, TemplateRef<void>>('emptyDataTemplate', { read: TemplateRef });
	public errorTemplate = contentChild<unknown, TemplateRef<void>>('errorTemplate', { read: TemplateRef });
	public toolbarTemplate = contentChild<unknown, TemplateRef<void>>('toolbarTemplate', { read: TemplateRef });
}
