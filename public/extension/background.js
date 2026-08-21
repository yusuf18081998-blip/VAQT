// VAQT Browser Blocker Background Engine
const DEFAULT_BLOCKED = [
  "*://*.instagram.com/*",
  "*://*.tiktok.com/*",
  "*://*.twitter.com/*",
  "*://*.x.com/*",
  "*://*.facebook.com/*",
  "*://*.netflix.com/*",
  "*://*.twitch.tv/*",
  "*://*.reddit.com/*",
  "*://*.youtube.com/shorts*"
];

chrome.runtime.onInstalled.addListener(() => {
  console.log("VAQT Focus Blocker o'rnatildi.");
});

// Update dynamic block rules
async function updateBlockRules(enable, customDomains = []) {
  if (!enable) {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map(r => r.id);
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIds });
    return;
  }

  const allPatterns = [...DEFAULT_BLOCKED];
  customDomains.forEach(domain => {
    allPatterns.push(`*://*.${domain}/*`);
    allPatterns.push(`*://${domain}/*`);
  });

  const rules = allPatterns.map((urlFilter, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        url: chrome.runtime.getURL("blocked.html")
      }
    },
    condition: {
      urlFilter: urlFilter,
      resourceTypes: ["main_frame"]
    }
  }));

  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = existingRules.map(r => r.id);
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIds,
    addRules: rules
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "TOGGLE_BLOCK") {
    updateBlockRules(request.enabled, request.customDomains).then(() => {
      sendResponse({ status: "ok" });
    });
    return true;
  }
});
