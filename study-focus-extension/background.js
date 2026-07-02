const BLOCKED_SITES = ["facebook.com", "youtube.com", "instagram.com", "tiktok.com"];
const BASE_ID = 1000;

function enableBlocking() {
    const rules = BLOCKED_SITES.map((site, index) => ({
        id: BASE_ID + index,
        priority: 1,
        action: { type: "redirect", redirect: { extensionPath: "/blocked.html" } },
        condition: { urlFilter: site, resourceTypes: ["main_frame"] }
    }));
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map(rule => rule.id),
        addRules: rules
    });
}

function disableBlocking() {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: BLOCKED_SITES.map((_, index) => BASE_ID + index)
    });
}

chrome.runtime.onMessage.addListener((request) => {
    // 1. Start Timer Action
    if (request.action === "startTimer") {
        // Use the duration sent from popup, default to 25 if undefined
        const duration = request.minutes || 25;
        
        // Save the exact time the session should end
        const endTime = Date.now() + (duration * 60 * 1000);
        chrome.storage.local.set({ endTime });

        enableBlocking();
        
        // Use the dynamic duration for the alarm
        chrome.alarms.create("studyAlarm", { delayInMinutes: duration });
    }

    // 2. Stop Timer Action
    if (request.action === "stopTimer") {
        chrome.storage.local.remove("endTime");
        chrome.alarms.clear("studyAlarm");
        disableBlocking();
    }
});

// Alarm Listener
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "studyAlarm") {
        chrome.storage.local.remove("endTime");
        disableBlocking();
    }
});