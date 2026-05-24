import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrNumbersOnlyDirective } from './str-numbers-only.directive';

@Component({
  template: `<input [strNumbersOnly]="enabled" />`,
  imports: [StrNumbersOnlyDirective],
})
class HostComponent {
  enabled = true;
}

describe('StrNumbersOnlyDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let input: HTMLInputElement;

  function type(value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  /**
   * Monta o componente com o estado inicial desejado.
   * Evita trocar enabled mid-test (ExpressionChangedAfterItHasBeenCheckedError).
   */
  function setup(enabled = true): void {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.enabled = enabled;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('remove letras do valor digitado', () => {
    setup();
    type('abc123');
    expect(input.value).toBe('123');
  });

  it('permite dígitos e um único ponto decimal', () => {
    setup();
    type('12.34');
    expect(input.value).toBe('12.34');
  });

  it('remove segundo ponto decimal, preservando o primeiro', () => {
    setup();
    type('12.34.56');
    expect(input.value).toBe('12.3456');
  });

  it('remove símbolos de moeda e separadores não numéricos', () => {
    setup();
    // vírgulas e espaços removidos; pontos são mantidos
    type('R$ 1.000,99');
    expect(input.value).toBe('1.00099');
  });

  it('não altera valor puramente numérico', () => {
    setup();
    type('9876');
    expect(input.value).toBe('9876');
  });

  it('não interfere quando a diretiva está desabilitada', () => {
    setup(false); // cria com enabled=false desde o início
    type('abc$% 1');
    expect(input.value).toBe('abc$% 1');
  });
});
