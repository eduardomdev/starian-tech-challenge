import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface TagConfig {
  label: string;
  backgroundColor: string;
  color: string;
}

const DEFAULT_TAG_CONFIG: TagConfig = {
  label: '',
  backgroundColor: '#f3f4f6',
  color: '#374151',
};

@Component({
  selector: 'str-tag',
  templateUrl: './str-tag.html',
  styleUrl: './str-tag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly value = input.required<string>();
  readonly config = input.required<Record<string, TagConfig>>();

  protected readonly resolvedConfig = computed<TagConfig>(() => {
    const key = this.value().toLowerCase();
    return this.config()[key] ?? { ...DEFAULT_TAG_CONFIG, label: this.value() };
  });
}
