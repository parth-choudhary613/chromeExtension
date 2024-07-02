/* global chrome */
const blocklistKey = "blocklist";
const enabledKey = "enabled";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ [blocklistKey]: [], [enabledKey]: true });
  updateRules();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes[blocklistKey] || changes[enabledKey]) {
    updateRules();
  }
});

function updateRules() {
  chrome.storage.sync.get([blocklistKey, enabledKey], (result) => {
    const blocklist = result[blocklistKey] || [];
    const enabled = result[enabledKey] !== false;

    console.log("Updating rules with blocklist:", blocklist, "and enabled:", enabled);

    // Clear all existing rules before adding new ones
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: Array.from({ length: blocklist.length }, (_, index) => index + 1),
        addRules: enabled
          ? blocklist.map((site, index) => ({
              id: index + 1,
              priority: 1,
              action: { type: "block" },
              condition: {
                urlFilter: site,
                resourceTypes: ["main_frame"],
              },
            }))
          : [],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log("Rules updated successfully");
        }
      }
    );
  });
}
