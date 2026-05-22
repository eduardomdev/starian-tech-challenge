import { computed, Signal } from '@angular/core';

export type SizeVariant = 'sm' | 'md' | 'lg';

export function createSizeComputed<T extends string>(
	size: Signal<SizeVariant>,
	config: Record<SizeVariant, T>
) {
	return computed(() => config[size()]);
}
