const USER_ID_KEY = 'str-user-id-counter';

export function nextUserId(): number {
  const current = parseInt(localStorage.getItem(USER_ID_KEY) ?? '0', 10);
  const next = current + 1;
  localStorage.setItem(USER_ID_KEY, String(next));
  return next;
}
