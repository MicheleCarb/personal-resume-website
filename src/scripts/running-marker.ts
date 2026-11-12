// The running station's spinner turns for a few seconds and then rests as a
// full ring (see PipelineStage.astro). This script only decides when: it
// holds the spin until the station's marker is on screen and replays it each
// time the marker comes back into view, so the build still reads as "in
// progress" when a reader reaches it. Without JavaScript the spinner plays
// once on load.

const running = document.querySelector<HTMLElement>(
  '.stage[data-status="running"]',
);
const runningMarker = running?.querySelector(".marker");

if (running && runningMarker) {
  running.dataset.spin = "wait";
  new IntersectionObserver(([entry]) => {
    running.dataset.spin = entry.isIntersecting ? "go" : "wait";
  }).observe(runningMarker);
}

export {};
