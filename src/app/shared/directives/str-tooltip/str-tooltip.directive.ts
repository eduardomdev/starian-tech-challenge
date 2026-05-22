import {
  Directive,
  ElementRef,
  Renderer2,
  DestroyRef,
  inject,
  signal,
  input,
  computed,
  effect,
  PLATFORM_ID,
  type OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const OFFSET = 6;
const VIEWPORT_PADDING = 12;
const ANIM_DIST = 4;

type Position = 'top' | 'bottom' | 'left' | 'right';

const OPPOSITES: Record<Position, Position> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const ANIM_TRANSFORMS: Record<Position, string> = {
  top: `translateY(${ANIM_DIST}px)`,
  bottom: `translateY(-${ANIM_DIST}px)`,
  left: `translateX(${ANIM_DIST}px)`,
  right: `translateX(-${ANIM_DIST}px)`,
};

@Directive({
  selector: '[strTooltip]',
  exportAs: 'strTooltip',
  host: {
    '(mouseenter)': 'onMouseEnter($event)',
    '(mouseleave)': 'onMouseLeave()',
    '(mousedown)': 'onInteraction()',
    '(mousemove)': 'onMouseMove($event)',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(click)': 'forceHide()',
    '(keydown.escape)': 'hide()',
    '(window:resize)': 'onResize()',
    '(window:scroll)': 'forceHide()',
    '(window:wheel)': 'forceHide()',
    '(window:touchmove)': 'forceHide()',
  },
})
export class StrTooltipDirective implements OnInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly strTooltip = input<string>('', { alias: 'strTooltip' });
  readonly strTooltipPosition = input<Position>('top');
  readonly tooltipShowDelay = input(0);
  readonly tooltipHideDelay = input(0);
  readonly tooltipDisabled = input(false);
  readonly tooltipMaxWidth = input('280px');
  readonly whenTruncate = input(false);
  readonly onCursor = input(false);
  readonly tooltipShortcuts = input<string[]>([]);

  private readonly hovered = signal(false);
  private readonly focused = signal(false);
  private readonly dragging = signal(false);
  private readonly inModal = signal(false);
  private readonly interacted = signal(false);
  private readonly cursorPos = signal<{ x: number; y: number } | null>(null);
  private tooltipEl: HTMLElement | null = null;
  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;

  private readonly canShow = computed(
    () =>
      !this.tooltipDisabled() &&
      !!this.strTooltip()?.trim() &&
      this.isBrowser &&
      (this.hovered() || this.focused()) &&
      !this.dragging() &&
      (!this.inModal() || this.interacted()) &&
      (!this.whenTruncate() || this.isTruncated()),
  );

  constructor() {
    effect(() => {
      this.strTooltip();
      this.strTooltipPosition();
      if (this.tooltipEl && this.isBrowser) {
        this.updatePosition();
      }
    });

    this.destroyRef.onDestroy(() => this.cleanup());
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.detectModal();
    }
  }

  show(): void {
    if (!this.canShow() || this.tooltipEl) return;
    this.clearTimers();

    const el = this.createTooltipElement();
    this.renderer.appendChild(document.body, el);
    this.tooltipEl = el;
    this.addScrollListener();

    el.offsetHeight;
    this.updatePosition();
    requestAnimationFrame(() => this.setStyles(el, { opacity: '1', transform: 'translate(0,0)' }));
  }

  hide(): void {
    const el = this.tooltipEl;
    if (!el) return;
    this.clearTimers();
    this.removeScrollListener();

    const pos = this.strTooltipPosition();
    this.setStyles(el, { opacity: '0', transform: ANIM_TRANSFORMS[pos] });
    el.parentNode?.removeChild(el);
    this.tooltipEl = null;
  }

  toggle(): void {
    this.tooltipEl ? this.hide() : this.show();
  }

  isTruncated(): boolean {
    if (!this.isBrowser) return false;
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } = this.el.nativeElement;
    if (scrollWidth <= clientWidth && scrollHeight <= clientHeight) return false;

    const style = getComputedStyle(this.el.nativeElement);
    const hidden = style.overflow === 'hidden' || style.overflowX === 'hidden';
    const ellipsis = style.textOverflow === 'ellipsis';

    if (ellipsis && hidden) return scrollWidth > clientWidth;
    if (hidden) return scrollHeight > clientHeight || scrollWidth > clientWidth;

    const noWrap = style.whiteSpace === 'nowrap' || style.whiteSpace === 'pre';
    if (noWrap && hidden) return scrollWidth > clientWidth;

    const isBlock = style.display === 'block' || style.display === 'inline-block';
    if (isBlock && style.lineHeight !== 'normal' && style.maxHeight !== 'none') {
      const lh = parseFloat(style.lineHeight);
      const mh = parseFloat(style.maxHeight);
      if (lh > 0 && mh > 0) return Math.ceil(scrollHeight / lh) > Math.floor(mh / lh);
    }

    return scrollWidth > clientWidth || scrollHeight > clientHeight;
  }

  protected onMouseEnter(e: MouseEvent): void {
    this.interacted.set(true);
    this.hovered.set(true);
    this.dragging.set(false);
    if (this.onCursor()) this.cursorPos.set({ x: e.clientX, y: e.clientY });
    this.scheduleShow();
  }

  protected onMouseLeave(): void {
    this.hovered.set(false);
    if (!this.onCursor()) this.cursorPos.set(null);
    this.scheduleHide();
  }

  protected onInteraction(): void {
    this.interacted.set(true);
    this.dragging.set(false);
  }

  protected onMouseMove(e: MouseEvent): void {
    if (e.buttons === 1) {
      this.dragging.set(true);
      if (this.tooltipEl) this.hide();
    }
  }

  protected onFocus(): void {
    setTimeout(() => this.interacted.set(true), 10);
    this.focused.set(true);
    this.scheduleShow();
  }

  protected onBlur(): void {
    this.focused.set(false);
    if (!this.hovered()) this.scheduleHide();
  }

  protected onResize(): void {
    if (this.tooltipEl) this.updatePosition();
  }

  protected forceHide(): void {
    this.clearTimers();
    this.hovered.set(false);
    this.focused.set(false);
    this.cursorPos.set(null);
    this.hide();
  }

  private scheduleShow(): void {
    this.clearTimers();
    if (!this.canShow()) return;
    this.showTimer = setTimeout(() => {
      if (this.canShow()) this.show();
    }, this.tooltipShowDelay());
  }

  private scheduleHide(): void {
    this.clearTimers();
    const delay = this.inModal()
      ? Math.min(this.tooltipHideDelay(), 100)
      : this.tooltipHideDelay();

    this.hideTimer = setTimeout(() => {
      if (!this.hovered() && !this.focused()) {
        if (this.onCursor()) this.cursorPos.set(null);
        this.hide();
      }
    }, delay);
  }

  private clearTimers(): void {
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
    this.showTimer = this.hideTimer = undefined;
  }

  private readonly onAnyScroll = (): void => {
    if (this.tooltipEl) this.forceHide();
  };

  private readonly onDocMouseMove = (e: MouseEvent): void => {
    if (!this.tooltipEl || !this.inModal()) return;
    const r = this.el.nativeElement.getBoundingClientRect();
    const inside =
      e.clientX >= r.left && e.clientX <= r.right &&
      e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) this.forceHide();
  };

  private readonly onDocClick = (e: MouseEvent): void => {
    if (!this.tooltipEl || !this.inModal()) return;
    if (!this.el.nativeElement.contains(e.target as Node)) this.forceHide();
  };

  private addScrollListener(): void {
    if (!this.isBrowser) return;
    document.addEventListener('scroll', this.onAnyScroll, true);
    if (this.inModal()) {
      document.addEventListener('mousemove', this.onDocMouseMove, true);
      document.addEventListener('click', this.onDocClick, true);
    }
  }

  private removeScrollListener(): void {
    if (!this.isBrowser) return;
    document.removeEventListener('scroll', this.onAnyScroll, true);
    document.removeEventListener('mousemove', this.onDocMouseMove, true);
    document.removeEventListener('click', this.onDocClick, true);
  }

  private detectModal(): void {
    const MODAL_SELECTORS =
      '.modal, .dialog, .overlay, .popup, .mat-dialog-container, .cdk-overlay-container, .p-dialog, .modal-dialog, dialog, [role="dialog"], [role="alertdialog"], [data-modal], [data-dialog]';
    const ancestor = this.el.nativeElement.closest(MODAL_SELECTORS);
    if (ancestor) this.inModal.set(true);
  }

  private createTooltipElement(): HTMLElement {
    const el = this.renderer.createElement('div') as HTMLElement;
    this.renderer.addClass(el, 'str-tooltip');
    this.renderer.addClass(el, `str-tooltip--${this.strTooltipPosition()}`);

    const text = this.strTooltip();
    const shortcuts = this.tooltipShortcuts();

    if (shortcuts.length > 0) {
      this.renderer.appendChild(el, this.renderer.createText(`${text} `));

      const container = this.renderer.createElement('span');
      this.renderer.addClass(container, 'str-tooltip-shortcuts');

      shortcuts.forEach((key, i) => {
        const kbd = this.renderer.createElement('span');
        this.renderer.addClass(kbd, 'str-tooltip-shortcut');
        this.renderer.setProperty(kbd, 'textContent', key);
        this.renderer.appendChild(container, kbd);
        if (i < shortcuts.length - 1) {
          this.renderer.appendChild(container, this.renderer.createText(' '));
        }
      });
      this.renderer.appendChild(el, container);
    } else {
      this.renderer.setProperty(el, 'textContent', text);
    }

    this.setStyles(el, {
      position: 'absolute',
      zIndex: '99999',
      maxWidth: this.tooltipMaxWidth(),
      opacity: '0',
      pointerEvents: 'none',
      visibility: 'hidden',
      transition: 'opacity .2s ease, transform .2s ease',
      boxSizing: 'border-box',
      transform: ANIM_TRANSFORMS[this.strTooltipPosition()],
    });

    return el;
  }

  private updatePosition(): void {
    const el = this.tooltipEl;
    if (!el) return;

    this.setStyles(el, { visibility: 'hidden', opacity: '1', transform: 'none' });

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tipRect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const pos = this.bestPosition(hostRect, tipRect, vw, vh);
    const coords = this.onCursor()
      ? this.cursorCoords(tipRect, pos, hostRect)
      : this.elementCoords(hostRect, tipRect, pos);

    this.updateClass(el, pos);
    this.setStyles(el, {
      top: `${Math.round(coords.top)}px`,
      left: `${Math.round(coords.left)}px`,
      visibility: 'visible',
      opacity: '0',
      transform: ANIM_TRANSFORMS[pos],
    });
  }

  private bestPosition(host: DOMRect, tip: DOMRect, vw: number, vh: number): Position {
    const space: Record<Position, number> = {
      top: host.top,
      bottom: vh - host.bottom,
      left: host.left,
      right: vw - host.right,
    };
    const need: Record<Position, number> = {
      top: tip.height + OFFSET,
      bottom: tip.height + OFFSET,
      left: tip.width + OFFSET,
      right: tip.width + OFFSET,
    };

    const pref = this.strTooltipPosition();
    if (space[pref] >= need[pref]) return pref;

    const opp = OPPOSITES[pref];
    if (space[opp] >= need[opp]) return opp;

    const all: Position[] = ['top', 'bottom', 'left', 'right'];
    return all.find((p) => space[p] >= need[p]) ?? 'bottom';
  }

  private elementCoords(host: DOMRect, tip: DOMRect, pos: Position): { top: number; left: number } {
    const sy = window.pageYOffset;
    const sx = window.pageXOffset;
    let top: number;
    let left: number;

    if (pos === 'top' || pos === 'bottom') {
      left = host.left + (host.width - tip.width) / 2 + sx;
      top = pos === 'top'
        ? host.top + sy - tip.height - OFFSET
        : host.bottom + sy + OFFSET;
    } else {
      top = host.top + (host.height - tip.height) / 2 + sy;
      left = pos === 'left'
        ? host.left + sx - tip.width - OFFSET
        : host.right + sx + OFFSET;
    }
    return this.clamp(top, left, tip);
  }

  private cursorCoords(tip: DOMRect, pos: Position, host: DOMRect): { top: number; left: number } {
    const cursor = this.cursorPos();
    if (!cursor) return this.elementCoords(host, tip, pos);

    const sy = window.pageYOffset;
    const sx = window.pageXOffset;
    let top: number;
    let left: number;

    if (pos === 'top' || pos === 'bottom') {
      left = cursor.x + sx - tip.width / 2;
      top = pos === 'top'
        ? host.top + sy - tip.height - OFFSET
        : host.bottom + sy + OFFSET;
    } else {
      top = cursor.y + sy - tip.height / 2;
      left = pos === 'left'
        ? host.left + sx - tip.width - OFFSET
        : host.right + sx + OFFSET;
    }
    return this.clamp(top, left, tip);
  }

  private clamp(top: number, left: number, tip: DOMRect): { top: number; left: number } {
    const sy = window.pageYOffset;
    const sx = window.pageXOffset;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return {
      top: Math.max(sy + VIEWPORT_PADDING, Math.min(top, vh + sy - tip.height - VIEWPORT_PADDING)),
      left: Math.max(sx + VIEWPORT_PADDING, Math.min(left, vw + sx - tip.width - VIEWPORT_PADDING)),
    };
  }

  private updateClass(el: HTMLElement, pos: Position): void {
    const oldPos = this.strTooltipPosition();
    if (oldPos !== pos) {
      this.renderer.removeClass(el, `str-tooltip--${oldPos}`);
      this.renderer.addClass(el, `str-tooltip--${pos}`);
    }
  }

  private setStyles(el: HTMLElement, styles: Record<string, string>): void {
    for (const [k, v] of Object.entries(styles)) {
      this.renderer.setStyle(el, k, v);
    }
  }

  private cleanup(): void {
    this.clearTimers();
    this.removeScrollListener();
    if (this.tooltipEl?.parentNode) {
      this.renderer.removeChild(document.body, this.tooltipEl);
    }
    this.tooltipEl = null;
  }
}
