import type { UserName } from '@shared/interfaces/user.interface';

export function getFullName(name: UserName): string {
  return `${name.firstname} ${name.lastname}`.trim();
}
