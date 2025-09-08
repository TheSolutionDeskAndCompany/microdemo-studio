import { safeSelector, maskValue } from "@microdemo/utils";

interface Step {
  index: number;
  action: "click" | "input" | "scroll" | "nav";
  selector?: string;
  selectorAlt?: string;
  textSnippet?: string;
  ariaRole?: string;
  bbox?: { x: number; y: number; width: number; height: number };
  scrollTop?: number;
  scrollLeft?: number;
  valueBefore?: string;
  valueAfter?: string;
  delayMs?: number;
  screenshotUrl?: string;
  caption?: string;
}

let steps: Step[] = [];
let lastEventTime = 0;
let recording = false;

function recordStep(step: Step) {
  const now = Date.now();
  step.delayMs = lastEventTime ? now - lastEventTime : 0;
  lastEventTime = now;
  steps.push(step);
}

function onClick(event: MouseEvent) {
  if (!recording) return;
  const target = event.target as Element;
  recordStep({
    index: steps.length,
    action: "click",
    selector: safeSelector(target),
    valueBefore: undefined,
    valueAfter: undefined,
  });
}

function onInput(event: Event) {
  if (!recording) return;
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  const value = maskValue(target?.name || target?.id, (target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)?.value);
  recordStep({
    index: steps.length,
    action: "input",
    selector: safeSelector(target),
    valueBefore: undefined,
    valueAfter: value,
  });
}

function onScroll(event: Event) {
  if (!recording) return;
  const target = event.target as Element;
  recordStep({
    index: steps.length,
    action: "scroll",
    scrollTop: (target as HTMLElement).scrollTop,
    scrollLeft: (target as HTMLElement).scrollLeft,
  });
}

function onNavigation() {
  if (!recording) return;
  recordStep({
    index: steps.length,
    action: "nav",
  });
}

function startRecording() {
  if (recording) return;
  steps = [];
  lastEventTime = 0;
  recording = true;
  window.addEventListener("click", onClick, true);
  window.addEventListener("input", onInput, true);
  window.addEventListener("scroll", onScroll, true);
  window.addEventListener("hashchange", onNavigation, true);
  window.addEventListener("popstate", onNavigation, true);
}

function stopRecording() {
  if (!recording) return;
  recording = false;
  window.removeEventListener("click", onClick, true);
  window.removeEventListener("input", onInput, true);
  window.removeEventListener("scroll", onScroll, true);
  window.removeEventListener("hashchange", onNavigation, true);
  window.removeEventListener("popstate", onNavigation, true);
  chrome.runtime.sendMessage({ type: "MICRODEMO_SAVE", payload: { steps } });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "MICRODEMO_TOGGLE") {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }
});

// Export as WXT content script so build can import without executing in-node
export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // No-op: this file relies on programmatic injection; listeners above handle runtime behavior.
  },
});
import { defineContentScript } from 'wxt/utils/define-content-script';
