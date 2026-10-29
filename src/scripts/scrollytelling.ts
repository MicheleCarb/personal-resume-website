// Pinned scrollytelling for the career pipeline (desktop). On wide screens
// with motion allowed, the pipeline is
// pinned and its stations become persistent cards stacked in a sticky stage.
// Scrolling drives one continuous progress value, p (0 = first station,
// 1 = second, ...); every card's position, window height, scale, opacity and
// accent are interpolated from its distance to p, so nothing ever switches
// abruptly. Elsewhere (phones, reduced motion, no JavaScript) nothing changes.
//
// The scroll schedule is measured once (and on resize): each card holds for
// a short dwell plus whatever scroll it needs to read content taller than its
// window, then the next card takes over across a fixed transition.

const section = document.querySelector<HTMLElement>("[data-scrolly]");
const track = section?.querySelector<HTMLElement>("[data-scrolly-track]");
const stage = section?.querySelector<HTMLElement>("[data-scrolly-stage]");
const list = stage?.querySelector<HTMLElement>(".pipeline");
const page = section?.parentElement;

if (section && track && stage && list && page) {
  const query = matchMedia(
    "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
  );
  const items = [...list.querySelectorAll<HTMLElement>(":scope > li")];
  const pending = items[0];
  const cards = items.slice(1);
  const bodies = cards.map((li) =>
    li.querySelector<HTMLElement>(".stage-body")!,
  );
  const contents = cards.map((li) =>
    li.querySelector<HTMLElement>(".stage-content")!,
  );
  const details = cards.map((li) => [...li.querySelectorAll("details")]);
  const initiallyOpen = details.map((all) => all.map((d) => d.open));

  const top = 16; // px from the viewport top to the pinned stage
  const gap = 12; // px between cards
  const recededScale = 0.97;
  const dimmedOpacity = 0.78; // keeps every text colour at WCAG AA

  type Card = { compact: number; window: number; read: number };
  let sizes: Card[] = [];
  let pendingHeight = 0;
  let holds: number[] = [];
  let transition = 0;
  let frame = 0;

  const clamp = (v: number, lo: number, hi: number) =>
    Math.min(Math.max(v, lo), hi);
  const ease = (t: number) => t * t * (3 - 2 * t);
  const sumCompact = (except: number) =>
    sizes.reduce((sum, s, k) => (k === except ? sum : sum + s.compact), 0);

  const measure = () => {
    cards.forEach((li) => (li.style.transform = ""));
    bodies.forEach((b) => (b.style.height = ""));
    contents.forEach((c) => (c.style.transform = ""));
    details.forEach((all) => all.forEach((d) => (d.open = true)));

    pendingHeight = pending.offsetHeight;
    const available = innerHeight - 2 * top;
    const raw = bodies.map((body, i) => {
      const full = body.offsetHeight;
      // Compact: the card down to its newest role's title and dates, so the
      // collapsed card always shows company, role and period.
      const newest = contents[i].querySelector<HTMLElement>(".step")!;
      const end = Math.max(
        ...[...newest.querySelectorAll<HTMLElement>("h4, .step-when")].map(
          (el) => el.getBoundingClientRect().bottom,
        ),
      );
      const padding = full - contents[i].offsetHeight;
      const compact = end - contents[i].getBoundingClientRect().top + padding;
      return { full, compact: Math.ceil(compact) };
    });
    sizes = raw.map(({ full, compact }) => ({
      compact,
      window: full,
      read: 0,
    }));
    sizes = raw.map(({ full, compact }, i) => {
      const room =
        available - pendingHeight - sumCompact(i) - gap * cards.length;
      const window = clamp(full, compact, room);
      return { compact, window, read: full - window };
    });

    const dwell = Math.round(innerHeight * 0.15);
    transition = Math.round(innerHeight * 0.35);
    holds = sizes.map((s) => s.read + dwell);
    const scroll =
      holds.reduce((a, b) => a + b, 0) + transition * (cards.length - 1);
    // Sized for the final state (last card open): the pin then releases
    // exactly where that layout ends, so the page continues without a gap.
    const last = cards.length - 1;
    const stageHeight =
      pendingHeight +
      gap * cards.length +
      sizes[last].window +
      sumCompact(last);
    stage.style.top = `${top}px`;
    stage.style.height = `${stageHeight}px`;
    track.style.height = `${stageHeight + scroll}px`;
  };

  // Progress p and how far the holding card has scrolled through its content.
  const progress = (offset: number) => {
    let start = 0;
    for (let i = 0; i < cards.length; i++) {
      const holdEnd = start + holds[i];
      if (offset < holdEnd || i === cards.length - 1) {
        return { p: i, reading: clamp(offset - start, 0, sizes[i].read) };
      }
      if (offset < holdEnd + transition) {
        return { p: i + ease((offset - holdEnd) / transition), reading: 0 };
      }
      start = holdEnd + transition;
    }
    return { p: cards.length - 1, reading: 0 };
  };

  const render = () => {
    frame = 0;
    const offset = top - track.getBoundingClientRect().top;
    const { p, reading } = progress(offset);
    let y = pendingHeight + gap;
    cards.forEach((li, i) => {
      const { compact, window, read } = sizes[i];
      const w = clamp(1 - Math.abs(i - p), 0, 1);
      const receded = clamp(p - i, 0, 1);
      const upcoming = clamp(i - p, 0, 1);
      const height = compact + (window - compact) * w;
      // Content offset: 0 before the card is reached, the reading position
      // while it holds, easing back to its header as it collapses.
      const shift = i > p ? 0 : i === p ? reading : read * w;
      const scale = 1 - (1 - recededScale) * receded;
      const dim = Math.max(receded, upcoming * 0.5);
      li.style.transform = `translateY(${y}px) scale(${scale})`;
      li.style.opacity = String(1 - (1 - dimmedOpacity) * dim);
      li.style.setProperty("--w", w.toFixed(3));
      bodies[i].style.height = `${height}px`;
      contents[i].style.transform = shift ? `translateY(${-shift}px)` : "";
      y += height * scale + gap;
    });

    // One continuous line from the first card's marker to the last one's.
    const centre = (li: HTMLElement) => {
      const r = li
        .querySelector<HTMLElement>(".marker")!
        .getBoundingClientRect();
      return r.top + r.height / 2;
    };
    const listTop = list.getBoundingClientRect().top;
    const first = centre(cards[0]);
    const last = centre(cards[cards.length - 1]);
    list.style.setProperty("--line-top", `${first - listTop}px`);
    list.style.setProperty("--line-height", `${last - first}px`);

    // Keep what follows the pipeline right under the last card: lifted into
    // leftover track space, or pushed down while the cards are taller than
    // the final layout. It reaches zero when the pin releases.
    const contentBottom =
      bodies[bodies.length - 1].getBoundingClientRect().bottom;
    const pull = track.getBoundingClientRect().bottom - contentBottom;
    page.style.setProperty("--scrolly-pull", `${pull}px`);
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const onResize = () => {
    measure();
    render();
  };

  // Keyboard users tabbing into a card are scrolled to where it is fully
  // open, so the focused element is always visible.
  const onFocus = (event: FocusEvent) => {
    const index = cards.findIndex((li) => li.contains(event.target as Node));
    if (index < 0) return;
    const start =
      holds.slice(0, index).reduce((a, b) => a + b, 0) + transition * index;
    const target = track.getBoundingClientRect().top + scrollY - top + start;
    if (Math.abs(scrollY - target) > holds[index]) scrollTo({ top: target });
  };

  // Re-measure whenever a card's content changes size (web font or logo
  // arriving, viewport width changing), so windows always fit their content.
  const observer = new ResizeObserver(() => {
    if (!section.classList.contains("is-scrolly")) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      measure();
      render();
    });
  });

  const enable = () => {
    section.classList.add("is-scrolly");
    measure();
    render();
    contents.forEach((c) => observer.observe(c));
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    section.addEventListener("focusin", onFocus);
  };

  const disable = () => {
    section.classList.remove("is-scrolly");
    observer.disconnect();
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", onResize);
    section.removeEventListener("focusin", onFocus);
    cards.forEach((li) => {
      ["transform", "opacity", "--w"].forEach((p) =>
        li.style.removeProperty(p),
      );
    });
    bodies.forEach((b) => b.style.removeProperty("height"));
    contents.forEach((c) => c.style.removeProperty("transform"));
    details.forEach((all, i) =>
      all.forEach((d, j) => (d.open = initiallyOpen[i][j])),
    );
    ["top", "height"].forEach((p) => stage.style.removeProperty(p));
    track.style.removeProperty("height");
    ["--line-top", "--line-height"].forEach((p) =>
      list.style.removeProperty(p),
    );
    page.style.removeProperty("--scrolly-pull");
  };

  const apply = () => (query.matches ? enable() : disable());
  query.addEventListener("change", apply);
  apply();
}
