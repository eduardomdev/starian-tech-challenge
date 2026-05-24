import { signal } from '@angular/core';
import { createSizeComputed, type SizeVariant } from './size-config';

describe('createSizeComputed', () => {
  const config = { sm: '32px', md: '40px', lg: '48px' };

  it('retorna o valor correspondente ao tamanho inicial', () => {
    const size = signal<SizeVariant>('md');
    const result = createSizeComputed(size, config);
    expect(result()).toBe('40px');
  });

  it('recomputa quando o signal de tamanho muda', () => {
    const size = signal<SizeVariant>('sm');
    const result = createSizeComputed(size, config);
    expect(result()).toBe('32px');
    size.set('lg');
    expect(result()).toBe('48px');
  });

  it('mapeia todos os três tamanhos corretamente', () => {
    const size = signal<SizeVariant>('sm');
    const result = createSizeComputed(size, config);
    (['sm', 'md', 'lg'] as SizeVariant[]).forEach(variant => {
      size.set(variant);
      expect(result()).toBe(config[variant]);
    });
  });

  it('funciona com config de tipos diferentes (ex.: números)', () => {
    const size = signal<SizeVariant>('md');
    const numConfig = { sm: 16, md: 24, lg: 40 };
    const result = createSizeComputed(size, numConfig);
    expect(result()).toBe(24);
    size.set('sm');
    expect(result()).toBe(16);
  });
});
