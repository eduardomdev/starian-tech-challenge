import { getFullName } from './user.utils';

describe('getFullName', () => {
  it('une firstname e lastname com espaço', () => {
    expect(getFullName({ firstname: 'João', lastname: 'Silva' })).toBe('João Silva');
  });

  it('remove espaços extras nas extremidades do resultado', () => {
    expect(getFullName({ firstname: 'Ana', lastname: '' })).toBe('Ana');
  });

  it('funciona quando ambos os campos estão vazios', () => {
    expect(getFullName({ firstname: '', lastname: '' })).toBe('');
  });
});
