// STUDIO_BASE_URL will be replaced at build time
const STUDIO_BASE_URL = 'http://localhost:3001'; // Default for development

// Use WXT background wrapper so build can import without executing Chrome APIs
export default defineBackground(() => {
  // Handle messages from content scripts and popup
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
      if (msg?.type !== "MICRODEMO_SAVE") return;
      try {
        const steps = msg?.payload?.steps ?? [];
        if (!steps.length) {
          return sendResponse({ ok: false, error: "No steps to save" });
        }
        const title = `Microdemo ${new Date().toLocaleString()}`;
        const response = await fetch(`${STUDIO_BASE_URL}/api/demos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, steps }),
        });
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`HTTP ${response.status}: ${error}`);
        }
        const result = await response.json();
        if (!result?.ok || !result?.publicId) {
          throw new Error("Invalid response from server");
        }
        const demoUrl = `${STUDIO_BASE_URL}/demos/${result.publicId}`;
        await chrome.tabs.create({ url: demoUrl });
        sendResponse({ ok: true, publicId: result.publicId, url: demoUrl });
      } catch (error) {
        console.error("Error saving demo:", error);
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      }
    })();
    return true; // Keep message channel open
  });

  // Toggle recording when the toolbar icon is clicked
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["content.js"],
        });
        chrome.tabs.sendMessage(tabs[0].id, { type: "MICRODEMO_TOGGLE" });
      }
    });
  });
});
import { defineBackground } from 'wxt/utils/define-background';
