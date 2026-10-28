// Experimental name split (branch exp/scrollytelling). On the first scroll,
// decorative copies of the name break at the shared handle ("Michele Carb" |
// "one"): "michelecarb" lifts into each handle row (LinkedIn, GitHub,
// website) and "one" lands on ".one". The real heading and links never
// text never changes (only its opacity, while the copies fly); the copies
// are aria-hidden. This script only measures positions;
// CSS scroll timelines move the copies. Off on phones (the links stack under
// the name), under reduced motion, and where scroll timelines are missing.

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
    ) => {
      const el = document.createElement("span");
      el.className = "split-piece";
      el.style.left = `${from.left - origin.left}px`;
      el.style.top = `${from.top - origin.top}px`;
      el.style.fontSize = source.fontSize;
      el.style.fontWeight = source.fontWeight;
      el.style.setProperty("--dx", `${to.left - from.left}px`);
      el.style.setProperty("--dy", `${to.top - from.top}px`);
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
    handles.forEach((el) =>
      piece(head, el.getBoundingClientRect(), name.slice(0, at), handle),
    );
    const end = suffixText.data.length;
    piece(
      tail,
      rectOf(suffixText, end - rest.length, end),
      name.slice(at),
      rest,
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
