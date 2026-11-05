(() => {
  // src/utils/key-maps.js
  var PREDEFINED_CODE_MAP = Object.freeze({
    83: { code: "KeyS", displayKey: "s" },
    // slower
    68: { code: "KeyD", displayKey: "d" },
    // faster
    90: { code: "KeyZ", displayKey: "z" },
    // rewind
    88: { code: "KeyX", displayKey: "x" },
    // advance
    82: { code: "KeyR", displayKey: "r" },
    // reset
    71: { code: "KeyG", displayKey: "g" },
    // fast
    86: { code: "KeyV", displayKey: "v" },
    // display
    77: { code: "KeyM", displayKey: "m" },
    // mark
    74: { code: "KeyJ", displayKey: "j" },
    // jump
    80: { code: "KeyP", displayKey: "p" },
    // pitch (Zovo Speed)
    65: { code: "KeyA", displayKey: "a" },
    // abloop (Zovo Speed)
    78: { code: "KeyN", displayKey: "n" }
    // skipsilence (Zovo Speed)
  });
  var KEYCODE_TO_CODE = Object.freeze({
    // Control keys
    8: "Backspace",
    13: "Enter",
    // NumpadEnter also produces 13 — we pick main Enter
    27: "Escape",
    32: "Space",
    46: "Delete",
    // Arrow keys
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    // Digit row (top)
    48: "Digit0",
    49: "Digit1",
    50: "Digit2",
    51: "Digit3",
    52: "Digit4",
    53: "Digit5",
    54: "Digit6",
    55: "Digit7",
    56: "Digit8",
    57: "Digit9",
    // Letter keys
    65: "KeyA",
    66: "KeyB",
    67: "KeyC",
    68: "KeyD",
    69: "KeyE",
    70: "KeyF",
    71: "KeyG",
    72: "KeyH",
    73: "KeyI",
    74: "KeyJ",
    75: "KeyK",
    76: "KeyL",
    77: "KeyM",
    78: "KeyN",
    79: "KeyO",
    80: "KeyP",
    81: "KeyQ",
    82: "KeyR",
    83: "KeyS",
    84: "KeyT",
    85: "KeyU",
    86: "KeyV",
    87: "KeyW",
    88: "KeyX",
    89: "KeyY",
    90: "KeyZ",
    // Numpad
    96: "Numpad0",
    97: "Numpad1",
    98: "Numpad2",
    99: "Numpad3",
    100: "Numpad4",
    101: "Numpad5",
    102: "Numpad6",
    103: "Numpad7",
    104: "Numpad8",
    105: "Numpad9",
    106: "NumpadMultiply",
    107: "NumpadAdd",
    109: "NumpadSubtract",
    110: "NumpadDecimal",
    111: "NumpadDivide",
    // Function keys
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    124: "F13",
    125: "F14",
    126: "F15",
    127: "F16",
    128: "F17",
    129: "F18",
    130: "F19",
    131: "F20",
    132: "F21",
    133: "F22",
    134: "F23",
    135: "F24",
    // Lock keys
    144: "NumLock",
    145: "ScrollLock",
    // Punctuation / symbols (US QWERTY positions)
    186: "Semicolon",
    187: "Equal",
    188: "Comma",
    189: "Minus",
    190: "Period",
    191: "Slash",
    192: "Backquote",
    219: "BracketLeft",
    220: "Backslash",
    221: "BracketRight",
    222: "Quote"
  });
  function displayKeyFromCode(code) {
    if (!code) {
      return "";
    }
    if (code.startsWith("Key") && code.length === 4) {
      return code.charAt(3).toLowerCase();
    }
    if (code.startsWith("Digit") && code.length === 6) {
      return code.charAt(5);
    }
    if (/^Numpad\d$/.test(code)) {
      return `Num ${code.charAt(6)}`;
    }
    const numpadOps = {
      NumpadEnter: "Num Enter",
      NumpadMultiply: "Num *",
      NumpadAdd: "Num +",
      NumpadSubtract: "Num -",
      NumpadDecimal: "Num .",
      NumpadDivide: "Num /"
    };
    if (numpadOps[code]) {
      return numpadOps[code];
    }
    const punctuation = {
      Semicolon: ";",
      Equal: "=",
      Comma: ",",
      Minus: "-",
      Period: ".",
      Slash: "/",
      Backquote: "`",
      BracketLeft: "[",
      Backslash: "\\",
      BracketRight: "]",
      Quote: "'"
    };
    if (punctuation[code]) {
      return punctuation[code];
    }
    return code;
  }
  var PREDEFINED_ACTIONS = [
    "slower",
    "faster",
    "rewind",
    "advance",
    "reset",
    "fast",
    "display",
    "mark",
    "jump",
    "pitch",
    "abloop",
    "skipsilence"
  ];
  var DEFAULT_BINDINGS = Object.freeze({
    slower: { code: "KeyS", key: 83, keyCode: 83, displayKey: "s", value: 0.1 },
    faster: { code: "KeyD", key: 68, keyCode: 68, displayKey: "d", value: 0.1 },
    rewind: { code: "KeyZ", key: 90, keyCode: 90, displayKey: "z", value: 10 },
    advance: { code: "KeyX", key: 88, keyCode: 88, displayKey: "x", value: 10 },
    reset: { code: "KeyR", key: 82, keyCode: 82, displayKey: "r", value: 1 },
    fast: { code: "KeyG", key: 71, keyCode: 71, displayKey: "g", value: 1.8 },
    display: { code: "KeyV", key: 86, keyCode: 86, displayKey: "v", value: 0 },
    mark: { code: "KeyM", key: 77, keyCode: 77, displayKey: "m", value: 0 },
    jump: { code: "KeyJ", key: 74, keyCode: 74, displayKey: "j", value: 0 },
    pitch: { code: "KeyP", key: 80, keyCode: 80, displayKey: "p", value: 0 },
    abloop: { code: "KeyA", key: 65, keyCode: 65, displayKey: "a", value: 0 },
    skipsilence: { code: "KeyN", key: 78, keyCode: 78, displayKey: "n", value: 0 }
  });

  // src/license/urls.js
  var EXTENSION_KEY = "zovospeed";
  var LICENSE_VERIFY_URL = "https://zgubxqomnbmxgbdhvwja.supabase.co/functions/v1/verify-extension-license";
  var LICENSE_VERIFY_TIMEOUT_MS = 5e3;
  var LICENSE_OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1e3;

  // src/license/feature-gate.js
  var SUPABASE_ANON_KEY = "sb_publishable_RG4IVO9Qm23_xPzdQjdFPQ_QHBwbOLv";
  var PRO_KEY_PATTERN = /^ZOVO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
  var MAX_KEY_LENGTH = 128;
  var OFFLINE_GRACE_MS = LICENSE_OFFLINE_GRACE_MS;
  async function localGet(defaults) {
    return new Promise((resolve) => {
      chrome.storage.local.get(defaults, (v) => resolve(v));
    });
  }
  async function localSet(items) {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, () => resolve());
    });
  }
  var cachedPro = false;
  var listeners = /* @__PURE__ */ new Set();
  function notifyTier(pro) {
    for (const cb of listeners) {
      try {
        cb(pro);
      } catch (err) {
        console.warn("[zspd] tier listener threw:", err);
      }
    }
  }
  async function setTier(pro, opts = {}) {
    const wasPro = cachedPro;
    cachedPro = pro;
    await localSet({ zspd_pro_status: pro ? "pro" : "free" });
    if (opts.key !== void 0) {
      await localSet({ zspd_pro_key: opts.key });
    }
    if (typeof opts.verifiedAt === "number") {
      await localSet({ zspd_pro_verified_at: opts.verifiedAt });
    }
    if (typeof opts.exp === "number") {
      await localSet({ zspd_pro_exp: opts.exp });
    }
    if (wasPro !== pro) {
      notifyTier(pro);
    }
  }
  async function refreshCachedTier() {
    const s = await localGet({
      zspd_pro_status: "free",
      zspd_pro_verified_at: 0,
      zspd_pro_exp: 0
    });
    if (s.zspd_pro_status !== "pro") {
      cachedPro = false;
      return false;
    }
    const now = Date.now();
    if (typeof s.zspd_pro_exp === "number" && s.zspd_pro_exp > 0 && now > s.zspd_pro_exp) {
      await setTier(false);
      return false;
    }
    if (typeof s.zspd_pro_verified_at !== "number" || s.zspd_pro_verified_at <= 0 || now - s.zspd_pro_verified_at > OFFLINE_GRACE_MS) {
      await setTier(false);
      return false;
    }
    cachedPro = true;
    return true;
  }
  function isValidKeyFormat(key) {
    return typeof key === "string" && PRO_KEY_PATTERN.test(key.trim());
  }
  function isApiResponse(v) {
    if (typeof v !== "object" || v === null) {
      return false;
    }
    if (typeof v.valid !== "boolean") {
      return false;
    }
    if (v.valid && (typeof v.tier !== "string" || v.tier.length === 0)) {
      return false;
    }
    return true;
  }
  async function isCacheStillPro(key) {
    const s = await localGet({
      zspd_pro_key: null,
      zspd_pro_status: "free",
      zspd_pro_verified_at: 0,
      zspd_pro_exp: 0
    });
    if (s.zspd_pro_key !== key || s.zspd_pro_status !== "pro") {
      return false;
    }
    const now = Date.now();
    if (typeof s.zspd_pro_exp === "number" && s.zspd_pro_exp > 0 && now > s.zspd_pro_exp) {
      return false;
    }
    return typeof s.zspd_pro_verified_at === "number" && s.zspd_pro_verified_at > 0 && now - s.zspd_pro_verified_at <= OFFLINE_GRACE_MS;
  }
  async function checkLicenseKey(rawKey) {
    if (typeof rawKey !== "string") {
      return { valid: false, pro: false, error: "License key is required" };
    }
    const key = rawKey.trim();
    if (key.length === 0 || key.length > MAX_KEY_LENGTH) {
      return { valid: false, pro: false, error: "License key is required" };
    }
    if (!isValidKeyFormat(key)) {
      return { valid: false, pro: false, error: "Invalid key format" };
    }
    if (!LICENSE_VERIFY_URL.startsWith("https://")) {
      return { valid: false, pro: false, error: "Insecure endpoint" };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LICENSE_VERIFY_TIMEOUT_MS);
    try {
      const res = await fetch(LICENSE_VERIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ license_key: key, extension: EXTENSION_KEY }),
        signal: controller.signal
      });
      let data;
      try {
        data = await res.json();
      } catch {
        return await offlineFallback(key);
      }
      if (!isApiResponse(data)) {
        return { valid: false, pro: false, error: "Unexpected server response" };
      }
      if (data.valid) {
        const pro = data.tier !== "free";
        await setTier(pro, {
          key,
          verifiedAt: Date.now(),
          exp: typeof data.exp === "number" && Number.isFinite(data.exp) ? data.exp : 0
        });
        return { valid: pro, pro };
      }
      await setTier(false, { key: null, verifiedAt: 0, exp: 0 });
      return { valid: false, pro: false, error: data.error ?? data.reason ?? "Invalid license key" };
    } catch {
      return await offlineFallback(key);
    } finally {
      clearTimeout(timer);
    }
  }
  async function offlineFallback(key) {
    if (await isCacheStillPro(key)) {
      return { valid: true, pro: true, cached: true };
    }
    return { valid: false, pro: false, error: "Could not reach license server" };
  }

  // src/background.js
  async function updateIcon(enabled) {
    try {
      const suffix = enabled ? "" : "_disabled";
      await chrome.action.setIcon({
        path: {
          19: `assets/icons/icon19${suffix}.png`,
          38: `assets/icons/icon38${suffix}.png`,
          48: `assets/icons/icon48${suffix}.png`
        }
      });
      console.log(`Icon updated: ${enabled ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Failed to update icon:", error);
    }
  }
  async function initializeIcon() {
    try {
      const storage = await chrome.storage.sync.get({ enabled: true });
      await updateIcon(storage.enabled);
    } catch (error) {
      console.error("Failed to initialize icon:", error);
      await updateIcon(true);
    }
  }
  async function migrateConfig() {
    const DEPRECATED_KEYS = [
      // Removed in v0.9.x
      "speeds",
      "version",
      // Replaced by smarter fight-back defaults in event-manager.js
      "forceLastSavedSpeed",
      // Migrated to keyBindings array in v0.6.x
      "resetSpeed",
      "speedStep",
      "fastSpeed",
      "rewindTime",
      "advanceTime",
      "resetKeyCode",
      "slowerKeyCode",
      "fasterKeyCode",
      "rewindKeyCode",
      "advanceKeyCode",
      "fastKeyCode",
      "displayKeyCode"
    ];
    try {
      await chrome.storage.sync.remove(DEPRECATED_KEYS);
      console.log("[VSC] Config migrated to current version");
    } catch (error) {
      console.error("[VSC] Config migration failed:", error);
    }
  }
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request?.action === "OPTIONS_VERIFY_KEY") {
      checkLicenseKey(request.key).then(
        (r) => sendResponse({
          ok: true,
          valid: r.valid,
          tier: r.pro ? "pro" : "free",
          error: r.error,
          cached: r.cached === true
        })
      ).catch((err) => sendResponse({ ok: false, error: err?.message || "verify failed" }));
      return true;
    }
    if (request?.action === "GET_PRO_STATUS") {
      refreshCachedTier().then((pro) => sendResponse({ ok: true, pro })).catch(() => sendResponse({ ok: false, pro: false }));
      return true;
    }
    return void 0;
  });
  refreshCachedTier().catch(() => {
  });
  async function migrateKeyBindingsV2() {
    try {
      const storage = await chrome.storage.sync.get(null);
      const bindings = storage.keyBindings;
      if (!bindings || !Array.isArray(bindings) || bindings.length === 0) {
        console.log("[VSC] Migration: no keyBindings in storage, skipping (fresh install)");
        return;
      }
      if (storage.schemaVersion === 2 && bindings.every((b) => b.code !== void 0)) {
        console.log("[VSC] Migration: already at v2, skipping");
        return;
      }
      let predefinedCount = 0;
      let customCount = 0;
      let unmappableCount = 0;
      const migrated = bindings.map((binding) => {
        if (binding.code !== void 0) {
          return binding;
        }
        const legacyKey = binding.key;
        if (binding.predefined && PREDEFINED_CODE_MAP[legacyKey]) {
          const mapped = PREDEFINED_CODE_MAP[legacyKey];
          predefinedCount++;
          return {
            ...binding,
            code: mapped.code,
            keyCode: legacyKey,
            displayKey: mapped.displayKey
          };
        }
        const code = KEYCODE_TO_CODE[legacyKey];
        if (code) {
          customCount++;
          return {
            ...binding,
            code,
            keyCode: legacyKey,
            displayKey: displayKeyFromCode(code)
          };
        }
        unmappableCount++;
        console.info(
          `[VSC] Migration: unmappable keyCode ${legacyKey} for action "${binding.action}"`
        );
        return {
          ...binding,
          code: null,
          keyCode: legacyKey,
          displayKey: ""
        };
      });
      const existingActions = new Set(migrated.map((b) => b.action));
      for (const action of PREDEFINED_ACTIONS) {
        if (!existingActions.has(action)) {
          const defaults = DEFAULT_BINDINGS[action];
          migrated.push({
            action,
            ...defaults,
            predefined: true
          });
          console.info(`[VSC] Migration: added missing predefined action "${action}"`);
        }
      }
      await chrome.storage.sync.set({
        keyBindings: migrated,
        schemaVersion: 2
      });
      console.log(
        `[VSC] Migration: ${predefinedCount} predefined, ${customCount} custom (${unmappableCount} unmappable)`
      );
    } catch (error) {
      console.error("[VSC] Key binding migration failed:", error);
    }
  }
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.enabled) {
      updateIcon(changes.enabled.newValue !== false);
    }
  });
  chrome.runtime.onInstalled.addListener(async () => {
    console.log("Video Speed Controller installed/updated");
    await migrateConfig();
    await migrateKeyBindingsV2();
    await initializeIcon();
  });
  chrome.runtime.onStartup.addListener(async () => {
    console.log("Video Speed Controller started");
    await initializeIcon();
  });
  initializeIcon();
  console.log("Video Speed Controller background script loaded");
})();
