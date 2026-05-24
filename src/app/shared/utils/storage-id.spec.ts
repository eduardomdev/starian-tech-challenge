import { nextUserId } from './storage-id';

const USER_ID_KEY = 'str-user-id-counter';

describe('nextUserId', () => {
  beforeEach(() => localStorage.removeItem(USER_ID_KEY));
  afterEach(() => localStorage.removeItem(USER_ID_KEY));

  it('retorna 1 quando localStorage não tem contador', () => {
    expect(nextUserId()).toBe(1);
  });

  it('incrementa a cada chamada', () => {
    expect(nextUserId()).toBe(1);
    expect(nextUserId()).toBe(2);
    expect(nextUserId()).toBe(3);
  });

  it('persiste o contador no localStorage', () => {
    nextUserId();
    nextUserId();
    expect(localStorage.getItem(USER_ID_KEY)).toBe('2');
  });

  it('retoma do valor salvo no localStorage', () => {
    localStorage.setItem(USER_ID_KEY, '10');
    expect(nextUserId()).toBe(11);
    expect(localStorage.getItem(USER_ID_KEY)).toBe('11');
  });

  it('ids gerados são sempre números inteiros positivos', () => {
    const ids = [nextUserId(), nextUserId(), nextUserId()];
    ids.forEach(id => {
      expect(Number.isInteger(id)).toBe(true);
      expect(id).toBeGreaterThan(0);
    });
  });
});
