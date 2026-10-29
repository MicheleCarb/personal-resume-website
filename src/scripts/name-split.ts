// Experimental hero sequence (branch exp/scrollytelling). Over the first
// 200px of scroll, one shared scroll timeline drives three things together:
// decorative copies of the name break at the shared handle ("Michele Carb" |
// "one"); the contact block descends from the top right to the column beside
// the intro; and the copies land on the handles at the block's final
// position, so "michelecarb" fills each row and "one" lands on ".one".
// The real heading and link text never change (the handles only step aside
// while the copies fly); the copies are aria-hidden and ignore the pointer.
// This script only measures; CSS scroll timelines do all the motion. Off on
// phones, under reduced motion, and where scroll timelines are missing.

const header = document.querySelector<HTMLElement>("[data-name-split]");
const heading = header?.querySelector("h1");

if (header && heading && CSS.supports("animation-timeline: scroll()")) {
  const query = matchMedia(
    "(min-width: 48rem) and (prefers-reduced-motion: no-preference)",
  );
  const handle = header.dataset.handle ?? "";
  let overlay: HTMLElement | null = null;

  const rectOf = (node: Text, start: number, end: number) => {
    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);
    return range.getBoundingClientRect();
  };

  // Where the handle's letters end in the name: "Michele Carb|one".
  const splitIndex = (name: string) => {
    let matched = 0;
    for (let i = 0; i < name.length && matched < handle.length; i++) {
      if (/\s/.test(name[i])) continue;
      if (name[i].toLowerCase() !== handle[matched]) return -1;
      if (++matched === handle.length) return i + 1;
    }
    return -1;
  };

  const build = () => {
    overlay?.remove();
    overlay = null;
    header.classList.remove("is-splitting");
    const node = heading.firstChild;
    if (!query.matches || !(node instanceof Text)) return;
    const name = node.data.trim();
    const at = splitIndex(name);
    const rest = name.slice(at).toLowerCase();
    const handles = [...header.querySelectorAll<HTMLElement>(".handle")];
    const suffix = [...header.querySelectorAll<HTMLElement>(".suffix")].find(
      (el) => rest && el.textContent?.endsWith(rest),
    );
    const suffixText = suffix?.firstChild;
    if (at < 0 || !handles.length || !(suffixText instanceof Text)) return;

    // How far the contact block descends: centred beside the intro, if the
    // intro leaves room for it on the right; otherwise it stays put.
    const links = header.querySelector("nav")!.getBoundingClientRect();
    const intro = document
      .querySelector("[data-hero-intro]")
      ?.getBoundingClientRect();
    // Whole pixels, so the links settle with crisp, unblurred text.
    const descent =
      intro && intro.right + 24 <= links.left
        ? Math.round(intro.top + (intro.height - links.height) / 2 - links.top)
        : 0;
    header.style.setProperty("--links-dy", `${descent}px`);

    const origin = header.getBoundingClientRect();
    const source = getComputedStyle(heading);
    overlay = document.createElement("div");
    overlay.className = "name-split";
    overlay.setAttribute("aria-hidden", "true");

    const piece = (
      from: DOMRect,
      to: DOMRect,
      fromText: string,
      toText: string,
      order: number,
      part: "head" | "tail",
    ) => {
      const el = document.createElement("span");
      el.className = "split-piece";
      el.dataset.part = part;
      el.style.setProperty("--order", String(order));
      el.style.left = `${from.left - origin.left}px`;
      el.style.top = `${from.top - origin.top}px`;
      el.style.fontSize = source.fontSize;
      el.style.fontWeight = source.fontWeight;
      // Anchored at the right edge: the copy shrinks toward the end of its
      // word ("Carb|", "one|") and travels from there, like an arrow drawn
      // from the end of the name.
      el.style.setProperty("--dx", `${to.right - from.right}px`);
      el.style.setProperty("--dy", `${to.top + descent - from.top}px`);
      el.style.setProperty("--s", String(to.height / from.height));
      const out = document.createElement("span");
      out.className = "split-from";
      out.textContent = fromText;
      const into = document.createElement("span");
      into.className = "split-to";
      into.textContent = toText;
      el.append(out, into);
      overlay!.append(el);
    };

    const head = rectOf(node, 0, node.data.indexOf(name) + at);
    const tailStart = node.data.indexOf(name) + at;
    const tail = rectOf(node, tailStart, tailStart + name.length - at);
    // The website row (with "one") leads and the rows above follow, so on the
    // way down the copies spread apart instead of catching up on each other.
    handles.forEach((el, i) =>
      piece(
        head,
        el.getBoundingClientRect(),
        name.slice(0, at),
        handle,
        handles.length - 1 - i,
        "head",
      ),
    );
    const end = suffixText.data.length;
    piece(
      tail,
      rectOf(suffixText, end - rest.length, end),
      name.slice(at),
      rest,
      0,
      "tail",
    );
    header.append(overlay);
    header.classList.add("is-splitting");
  };

  let frame = 0;
  const rebuild = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(build);
  };
  document.fonts.ready.then(rebuild);
  addEventListener("resize", rebuild);
  query.addEventListener("change", rebuild);
}
