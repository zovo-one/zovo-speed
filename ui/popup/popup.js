(() => {
  // src/license/urls.js
  var EXTENSION_SLUG = "zovospeed";
  var LICENSE_OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1e3;
  function PRICING_URL(surface) {
    const u = new URL("https://zovo.one/pricing");
    u.searchParams.set("utm_source", EXTENSION_SLUG);
    u.searchParams.set("utm_medium", "extension");
    u.searchParams.set("utm_campaign", "upgrade");
    u.searchParams.set("utm_content", surface);
    return u.toString();
  }

  // src/ui/popup/popup.js
  var MessageTypes = {
    SET_SPEED: "VSC_SET_SPEED",
    ADJUST_SPEED: "VSC_ADJUST_SPEED",
    RESET_SPEED: "VSC_RESET_SPEED",
    TOGGLE_DISPLAY: "VSC_TOGGLE_DISPLAY",
    GET_STATE: "VSC_GET_STATE"
  };
  var UPGRADE_URL = PRICING_URL("popup");
  document.addEventListener("DOMContentLoaded", () => {
    loadSettingsAndInitialize();
    document.querySelector("#config").addEventListener("click", () => {
      chrome.runtime.openOptionsPage();
    });
    document.querySelector("#disable").addEventListener("click", function() {
      const isCurrentlyEnabled = !this.classList.contains("disabled");
      toggleEnabled(!isCurrentlyEnabled, settingsSavedReloadMessage);
    });
    chrome.storage.sync.get({ enabled: true }, (storage) => {
      toggleEnabledUI(storage.enabled);
    });
    function toggleEnabled(enabled, callback) {
      chrome.storage.sync.set(
        {
          enabled
        },
        () => {
          toggleEnabledUI(enabled);
          if (callback) {
            callback(enabled);
          }
        }
      );
    }
    function toggleEnabledUI(enabled) {
      const disableBtn = document.querySelector("#disable");
      disableBtn.classList.toggle("disabled", !enabled);
      disableBtn.setAttribute("aria-checked", enabled ? "true" : "false");
      disableBtn.title = enabled ? "Disable Extension" : "Enable Extension";
    }
    function refreshLiveSpeed() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) {
          return;
        }
        chrome.tabs.sendMessage(tabs[0].id, { type: MessageTypes.GET_STATE }, (resp) => {
          if (chrome.runtime.lastError || !resp || typeof resp.speed !== "number") {
            return;
          }
          document.querySelector("#live-speed").textContent = `${resp.speed.toFixed(2)}\xD7`;
          markActivePreset(resp.speed);
        });
      });
    }
    function markActivePreset(speed) {
      document.querySelectorAll(".preset-btn").forEach((btn) => {
        const match = Math.abs(parseFloat(btn.dataset.speed) - speed) < 5e-3;
        btn.classList.toggle("is-active", match);
        btn.setAttribute("aria-pressed", match ? "true" : "false");
      });
    }
    refreshLiveSpeed();
    function settingsSavedReloadMessage(enabled) {
      setStatusMessage(`${enabled ? "Enabled" : "Disabled"}. Reload page.`);
    }
    function setStatusMessage(str) {
      const status_element = document.querySelector("#status");
      status_element.classList.toggle("hide", false);
      status_element.innerText = str;
    }
    function loadSettingsAndInitialize() {
      chrome.storage.sync.get(null, (storage) => {
        let slowerStep = 0.1;
        let fasterStep = 0.1;
        let resetSpeed = 1;
        if (storage.keyBindings && Array.isArray(storage.keyBindings)) {
          const slowerBinding = storage.keyBindings.find((kb) => kb.action === "slower");
          const fasterBinding = storage.keyBindings.find((kb) => kb.action === "faster");
          const fastBinding = storage.keyBindings.find((kb) => kb.action === "fast");
          if (slowerBinding && typeof slowerBinding.value === "number") {
            slowerStep = slowerBinding.value;
          }
          if (fasterBinding && typeof fasterBinding.value === "number") {
            fasterStep = fasterBinding.value;
          }
          if (fastBinding && typeof fastBinding.value === "number") {
            resetSpeed = fastBinding.value;
          }
        }
        updateSpeedControlsUI(slowerStep, fasterStep, resetSpeed);
        initializeSpeedControls();
        initializeExtras(storage);
      });
    }
    function initializeExtras(storage) {
      const pitchBox = document.querySelector("#ext-pitch");
      const siteMemBox = document.querySelector("#ext-sitemem");
      const silenceBox = document.querySelector("#ext-silence");
      const upgradeCta = document.querySelector("#upgrade-cta");
      upgradeCta.href = UPGRADE_URL;
      pitchBox.checked = storage.pitchCorrect !== false;
      siteMemBox.checked = storage.siteMemory !== false;
      silenceBox.checked = Boolean(storage.skipSilenceEnabled);
      pitchBox.addEventListener("change", () => {
        chrome.storage.sync.set({ pitchCorrect: pitchBox.checked });
      });
      siteMemBox.addEventListener("change", () => {
        chrome.storage.sync.set({ siteMemory: siteMemBox.checked });
      });
      silenceBox.addEventListener("change", () => {
        chrome.storage.sync.set({ skipSilenceEnabled: silenceBox.checked });
      });
      chrome.runtime.sendMessage({ action: "GET_PRO_STATUS" }, (res) => {
        if (chrome.runtime.lastError) {
          return;
        }
        const pro = res?.ok && res.pro === true;
        upgradeCta.classList.toggle("hide", pro);
        document.querySelector(".pro-tag").textContent = pro ? "Pro \u2713" : "Pro";
      });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        let host = "";
        try {
          host = tab?.url ? new URL(tab.url).hostname.replace(/^www\./, "") : "";
        } catch {
          host = "";
        }
        if (!host || !/^https?:/.test(tab?.url || "")) {
          return;
        }
        const learned = storage.siteSpeeds && storage.siteSpeeds[host];
        const line = document.querySelector("#site-line");
        const text = document.querySelector("#site-line-text");
        if (typeof learned === "number") {
          text.textContent = `${host}: remembered ${learned}x`;
        } else {
          text.textContent = `${host}: no speed remembered yet`;
        }
        line.classList.remove("hide");
        document.querySelector("#site-forget").addEventListener("click", () => {
          chrome.storage.sync.get({ siteSpeeds: {} }, (s) => {
            const map = s.siteSpeeds || {};
            delete map[host];
            chrome.storage.sync.set({ siteSpeeds: map }, () => {
              text.textContent = `${host}: no speed remembered yet`;
            });
          });
        });
      });
    }
    function updateSpeedControlsUI(slowerStep, fasterStep, resetSpeed) {
      const decreaseBtn = document.querySelector("#speed-decrease");
      if (decreaseBtn) {
        decreaseBtn.dataset.delta = -slowerStep;
        decreaseBtn.querySelector("span").textContent = `-${slowerStep}`;
      }
      const increaseBtn = document.querySelector("#speed-increase");
      if (increaseBtn) {
        increaseBtn.dataset.delta = fasterStep;
        increaseBtn.querySelector("span").textContent = `+${fasterStep}`;
      }
      const resetBtn = document.querySelector("#speed-reset");
      if (resetBtn) {
        resetBtn.textContent = resetSpeed.toString();
      }
    }
    function initializeSpeedControls() {
      document.querySelector("#speed-decrease").addEventListener("click", function() {
        const delta = parseFloat(this.dataset.delta);
        adjustSpeed(delta);
      });
      document.querySelector("#speed-increase").addEventListener("click", function() {
        const delta = parseFloat(this.dataset.delta);
        adjustSpeed(delta);
      });
      document.querySelector("#speed-reset").addEventListener("click", function() {
        const preferredSpeed = parseFloat(this.textContent);
        setSpeed(preferredSpeed);
      });
      document.querySelectorAll(".preset-btn").forEach((btn) => {
        btn.addEventListener("click", function() {
          const speed = parseFloat(this.dataset.speed);
          setSpeed(speed);
        });
      });
    }
    function setSpeed(speed) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) {
          return;
        }
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: MessageTypes.SET_SPEED, payload: { speed } },
          () => {
            if (chrome.runtime.lastError) {
              setStatusMessage("No playable media on this page.");
              return;
            }
            setTimeout(refreshLiveSpeed, 200);
          }
        );
      });
    }
    function adjustSpeed(delta) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) {
          return;
        }
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: MessageTypes.ADJUST_SPEED, payload: { delta } },
          () => {
            if (chrome.runtime.lastError) {
              setStatusMessage("No playable media on this page.");
              return;
            }
            setTimeout(refreshLiveSpeed, 200);
          }
        );
      });
    }
  });
})();
