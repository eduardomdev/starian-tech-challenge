import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'str-avatar',
  template: `<span class="avatar-initials" aria-hidden="true">{{ initials() }}</span>`,
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    '[attr.aria-label]': 'name()',
  },
})
export class StrAvatarComponent {
  public name = input.required<string>();

  protected initials = computed(() => {
    const parts = this.name().trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });
}
