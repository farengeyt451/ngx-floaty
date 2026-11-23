import { computePosition, flip } from '@floating-ui/dom';

function createBox(styles: Partial<CSSStyleDeclaration>): HTMLElement {
  const el = document.createElement('div');
  Object.assign(el.style, styles);
  document.body.append(el);
  return el;
}

describe('layout (browser)', () => {
  let reference: HTMLElement;
  let floating: HTMLElement;

  beforeEach(() => {
    reference = createBox({ position: 'absolute', top: '200px', left: '200px', width: '100px', height: '40px' });
    floating = createBox({ position: 'fixed', top: '0', left: '0', width: '80px', height: '30px' });
  });

  afterEach(() => {
    reference.remove();
    floating.remove();
  });

  it('measures real layout', () => {
    expect(reference.getBoundingClientRect()).toMatchObject({ width: 100, height: 40 });
  });

  it('places the floating element below the reference', async () => {
    const { x, y, placement } = await computePosition(reference, floating, {
      placement: 'bottom',
      strategy: 'fixed',
    });

    expect(placement).toBe('bottom');
    expect(x).toBe(210);
    expect(y).toBe(240);
  });

  it('flips when there is no room on the preferred side', async () => {
    reference.style.top = '0';

    const { placement } = await computePosition(reference, floating, {
      placement: 'top',
      strategy: 'fixed',
      middleware: [flip()],
    });

    expect(placement).toBe('bottom');
  });
});
