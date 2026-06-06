const inputIds = [
  "scenario",
  "historyPeakDayOrders",
  "historyPeakHourOrders",
  "historyExceptionRate",
  "historyReturnRate",
  "historySingleSingleShare",
  "historySingleMultiShare",
  "historyMultiSingleShare",
  "historyMultiMultiShare",
  "forecastOrders",
  "campaignDays",
  "peakDayShare",
  "peakHourShare",
  "forecastSingleSingleShare",
  "forecastSingleMultiShare",
  "forecastMultiSingleShare",
  "forecastMultiMultiShare",
  "hotSingleMultiShare",
  "safetyThresholdMode",
  "safetyThresholdValue",
  "pickRate",
  "pickStaff",
  "hotCheckPackRate",
  "hotCheckPackStaff",
  "normalCheckPackRate",
  "normalCheckPackStaff",
  "shipRate",
  "shipStaff",
  "workHours",
  "bufferRate",
  "pdaCount",
  "printerCount",
  "printerRate",
  "orderpickerCount",
  "orderpickerStaffCoverage",
  "riderCount",
  "riderStaffCoverage",
  "forkliftCount",
  "forkliftStaffCoverage",
  "equipmentReserve",
  "tempStaffPool",
  "skilledShare",
  "backupStaff",
  "overtimeHours",
  "cartonSStock",
  "cartonSShare",
  "cartonMStock",
  "cartonMShare",
  "cartonLStock",
  "cartonLShare",
  "cartonXLStock",
  "cartonXLShare",
  "bagSStock",
  "bagSShare",
  "bagMStock",
  "bagMShare",
  "bagLStock",
  "bagLShare",
  "bagXLStock",
  "bagXLShare",
  "labelStock",
  "tapeStock",
  "tapeCoverage",
  "fillerStock",
  "fillerUseRate",
  "materialSafety",
  "wmsSnapshot"
];

const capacityInputIds = [
  "capModelName",
  "capPeakOrders",
  "capBufferRate",
  "capTempStaffPool",
  "capHotSingleMultiShare",
  "capPdaCount",
  "capDeviceReserve",
  "capPrinterCount",
  "capPrinterRate",
  "capOrderpickerCount",
  "capOrderpickerCoverage",
  "capRiderCount",
  "capRiderCoverage",
  "capForkliftCount",
  "capForkliftCoverage",
  "capMonitorSnapshot"
];

const structureTypes = [
  {
    key: "singleSingle",
    name: "单品单件",
    historyShareId: "historySingleSingleShare",
    forecastShareId: "forecastSingleSingleShare",
    itemsId: "singleSingleItems",
    skusId: "singleSingleSkus",
    packagesId: "singleSinglePackages",
    defaultItems: 1,
    defaultSkus: 1,
    defaultPackages: 1,
    complexity: 1
  },
  {
    key: "singleMulti",
    name: "单品多件",
    historyShareId: "historySingleMultiShare",
    forecastShareId: "forecastSingleMultiShare",
    itemsId: "singleMultiItems",
    skusId: "singleMultiSkus",
    packagesId: "singleMultiPackages",
    defaultItems: 3,
    defaultSkus: 3,
    defaultPackages: 3,
    complexity: 1.12
  },
  {
    key: "multiSingle",
    name: "多品单件",
    historyShareId: "historyMultiSingleShare",
    forecastShareId: "forecastMultiSingleShare",
    itemsId: "multiSingleItems",
    skusId: "multiSingleSkus",
    packagesId: "multiSinglePackages",
    defaultItems: 2.5,
    defaultSkus: 2.5,
    defaultPackages: 2.5,
    complexity: 1.28
  },
  {
    key: "multiMulti",
    name: "多品多件",
    historyShareId: "historyMultiMultiShare",
    forecastShareId: "forecastMultiMultiShare",
    itemsId: "multiMultiItems",
    skusId: "multiMultiSkus",
    packagesId: "multiMultiPackages",
    defaultItems: 5,
    defaultSkus: 3.2,
    defaultPackages: 5,
    complexity: 1.55
  }
];

const capacityStructureTypes = [
  { key: "singleSingle", name: "单品单件", itemsPerOrder: 1 },
  { key: "singleMulti", name: "单品多件", itemsPerOrder: 3 },
  { key: "multiSingle", name: "多品单件", itemsPerOrder: 2 },
  { key: "multiMulti", name: "多品多件", itemsPerOrder: 5 }
];

const materialRows = [
  { key: "cartonS", name: "S箱", stockId: "cartonSStock", shareId: "cartonSShare", unit: "个" },
  { key: "cartonM", name: "M箱", stockId: "cartonMStock", shareId: "cartonMShare", unit: "个" },
  { key: "cartonL", name: "L箱", stockId: "cartonLStock", shareId: "cartonLShare", unit: "个" },
  { key: "cartonXL", name: "XL箱", stockId: "cartonXLStock", shareId: "cartonXLShare", unit: "个" },
  { key: "bagS", name: "S袋", stockId: "bagSStock", shareId: "bagSShare", unit: "个" },
  { key: "bagM", name: "M袋", stockId: "bagMStock", shareId: "bagMShare", unit: "个" },
  { key: "bagL", name: "L袋", stockId: "bagLStock", shareId: "bagLShare", unit: "个" },
  { key: "bagXL", name: "XL袋", stockId: "bagXLStock", shareId: "bagXLShare", unit: "个" }
];

const materialProfileMaterials = materialRows.map((row) => ({
  key: row.key,
  name: row.name
}));

const initialValues = {};
const initialDynamicHtml = {};
const initialMaterialProfileValues = {};
let latestReport = "";
let latestWmsData = {};
let latestResult = null;
let latestCapacityMonitor = {};
const templateStoreKey = "dacuPrepWarehouseTemplatesV1";
const loginSessionKey = "dacuPrepLoginRole";
const passwords = {
  guest: "3Wildcats！",
  admin: "admin123"
};

for (const id of [...inputIds, ...capacityInputIds]) {
  const element = document.getElementById(id);
  if (element) initialValues[id] = element.value;
}

for (const id of ["hotSkuRows", "safetyStockRows", "capStructureInputRows", "capProcessRows"]) {
  const element = document.getElementById(id);
  if (element) initialDynamicHtml[id] = element.innerHTML;
}

document.querySelectorAll(".material-profile-share, .material-profile-filler").forEach((input) => {
  const key = `${input.dataset.scenario}:${input.dataset.type}:${input.dataset.material || "filler"}`;
  initialMaterialProfileValues[key] = input.value;
});

function value(id) {
  const element = document.getElementById(id);
  return element ? element.value : "";
}

function num(id) {
  const parsed = Number(value(id));
  return Number.isFinite(parsed) ? parsed : 0;
}

function numOrDefault(id, fallback) {
  const element = document.getElementById(id);
  if (!element) return fallback;
  const parsed = Number(element.value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function pct(id) {
  return num(id) / 100;
}

function fmt(value) {
  return Math.round(value || 0).toLocaleString("zh-CN");
}

function one(value) {
  return Number(value || 0).toLocaleString("zh-CN", {
    maximumFractionDigits: 1
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setValue(id, nextValue) {
  const element = document.getElementById(id);
  if (element) element.value = nextValue;
}

function rowValue(row, selector) {
  const element = row.querySelector(selector);
  return element ? element.value : "";
}

function rowNumber(row, selector) {
  const parsed = Number(rowValue(row, selector));
  return Number.isFinite(parsed) ? parsed : 0;
}

function activeScenario() {
  return value("scenario") === "capacity" ? "capacity" : "warehouse";
}

function isAdminAccount() {
  return value("accountRole") === "admin";
}

function isValidPassword(role, password) {
  if (role === "guest") return password === passwords.guest || password === "3Wildcats!";
  if (role === "admin") return password === passwords.admin;
  return false;
}

function showLogin() {
  document.getElementById("loginScreen").classList.remove("is-hidden");
  document.getElementById("appShell").classList.add("is-hidden");
  document.getElementById("loginPassword").value = "";
  document.getElementById("loginError").textContent = "";
}

function enterApp(role) {
  sessionStorage.setItem(loginSessionKey, role);
  if (role === "admin") sessionStorage.setItem("dacuPrepAdminAuthed", "1");
  else sessionStorage.removeItem("dacuPrepAdminAuthed");
  setValue("accountRole", role);
  document.getElementById("loginScreen").classList.add("is-hidden");
  document.getElementById("appShell").classList.remove("is-hidden");
  updateAccountControls();
  updateScenarioTitle();
}

function login() {
  const role = value("loginRole");
  const password = value("loginPassword");
  if (!isValidPassword(role, password)) {
    document.getElementById("loginError").textContent = "密码错误";
    return;
  }
  enterApp(role);
}

function logout() {
  sessionStorage.removeItem(loginSessionKey);
  sessionStorage.removeItem("dacuPrepAdminAuthed");
  setValue("accountRole", "guest");
  updateAccountControls();
  showLogin();
}

function getScenarioInputIds(scenario) {
  const ids = scenario === "capacity" ? capacityInputIds : inputIds;
  return ids.filter((id) => id !== "scenario" && id !== "wmsSnapshot" && id !== "capMonitorSnapshot");
}

function getScenarioHtmlIds(scenario) {
  return scenario === "capacity"
    ? ["capProcessRows"]
    : ["hotSkuRows", "safetyStockRows"];
}

function defaultWarehouseName() {
  return "默认仓库";
}

const sharedFieldPairs = [
  { key: "bufferRate", warehouse: "bufferRate", capacity: "capBufferRate" },
  { key: "tempStaffPool", warehouse: "tempStaffPool", capacity: "capTempStaffPool" },
  { key: "pdaCount", warehouse: "pdaCount", capacity: "capPdaCount" },
  { key: "printerCount", warehouse: "printerCount", capacity: "capPrinterCount" },
  { key: "printerRate", warehouse: "printerRate", capacity: "capPrinterRate" },
  { key: "orderpickerCount", warehouse: "orderpickerCount", capacity: "capOrderpickerCount" },
  { key: "orderpickerCoverage", warehouse: "orderpickerStaffCoverage", capacity: "capOrderpickerCoverage" },
  { key: "riderCount", warehouse: "riderCount", capacity: "capRiderCount" },
  { key: "riderCoverage", warehouse: "riderStaffCoverage", capacity: "capRiderCoverage" },
  { key: "forkliftCount", warehouse: "forkliftCount", capacity: "capForkliftCount" },
  { key: "forkliftCoverage", warehouse: "forkliftStaffCoverage", capacity: "capForkliftCoverage" },
  { key: "equipmentReserve", warehouse: "equipmentReserve", capacity: "capDeviceReserve" },
  { key: "hotSingleMultiShare", warehouse: "hotSingleMultiShare", capacity: "capHotSingleMultiShare" },
  { key: "cartonSStock", warehouse: "cartonSStock", capacity: "cartonSStock" },
  { key: "cartonMStock", warehouse: "cartonMStock", capacity: "cartonMStock" },
  { key: "cartonLStock", warehouse: "cartonLStock", capacity: "cartonLStock" },
  { key: "cartonXLStock", warehouse: "cartonXLStock", capacity: "cartonXLStock" },
  { key: "bagSStock", warehouse: "bagSStock", capacity: "bagSStock" },
  { key: "bagMStock", warehouse: "bagMStock", capacity: "bagMStock" },
  { key: "bagLStock", warehouse: "bagLStock", capacity: "bagLStock" },
  { key: "bagXLStock", warehouse: "bagXLStock", capacity: "bagXLStock" },
  { key: "labelStock", warehouse: "labelStock", capacity: "labelStock" },
  { key: "tapeStock", warehouse: "tapeStock", capacity: "tapeStock" },
  { key: "tapeCoverage", warehouse: "tapeCoverage", capacity: "tapeCoverage" },
  { key: "fillerStock", warehouse: "fillerStock", capacity: "fillerStock" },
  { key: "materialSafety", warehouse: "materialSafety", capacity: "materialSafety" }
];

const sharedStructurePairs = [
  { key: "singleSingle", warehouse: "forecastSingleSingleShare" },
  { key: "singleMulti", warehouse: "forecastSingleMultiShare" },
  { key: "multiSingle", warehouse: "forecastMultiSingleShare" },
  { key: "multiMulti", warehouse: "forecastMultiMultiShare" }
];

const sharedProcessPairs = [
  { key: "pick", warehouseRate: "pickRate", warehouseStaff: "pickStaff", keywords: ["拣货"] },
  { key: "hotCheckPack", warehouseRate: "hotCheckPackRate", warehouseStaff: "hotCheckPackStaff", keywords: ["爆品复核打包"] },
  { key: "normalCheckPack", warehouseRate: "normalCheckPackRate", warehouseStaff: "normalCheckPackStaff", keywords: ["非爆品复核打包"] },
  { key: "ship", warehouseRate: "shipRate", warehouseStaff: "shipStaff", keywords: ["组发运", "发运"] }
];

function snapshotContainerHtml(id) {
  const element = document.getElementById(id);
  if (!element) return "";
  const clone = element.cloneNode(true);
  clone.querySelectorAll("input").forEach((input) => {
    input.setAttribute("value", input.value);
  });
  clone.querySelectorAll("textarea").forEach((textarea) => {
    textarea.textContent = textarea.value;
  });
  clone.querySelectorAll("select").forEach((select) => {
    select.querySelectorAll("option").forEach((option) => {
      option.toggleAttribute("selected", option.value === select.value);
    });
  });
  return clone.innerHTML;
}

function captureTemplateSnapshot(scenario) {
  const values = {};
  for (const id of getScenarioInputIds(scenario)) {
    values[id] = value(id);
  }
  const html = {};
  for (const id of getScenarioHtmlIds(scenario)) {
    html[id] = snapshotContainerHtml(id);
  }
  const snapshot = {
    values,
    html,
    savedAt: new Date().toISOString()
  };
  if (scenario === "capacity") {
    snapshot.structureShares = {};
    document.querySelectorAll(".cap-structure-share").forEach((input) => {
      snapshot.structureShares[input.dataset.type] = input.value;
    });
  }
  return snapshot;
}

function findCapProcessRow(pair) {
  const rows = [...document.querySelectorAll("#capProcessRows .cap-process-input-row")];
  if (pair.key === "normalCheckPack") {
    return rows.find((row) => rowValue(row, ".cap-process-name").includes("非爆品"));
  }
  if (pair.key === "hotCheckPack") {
    return rows.find((row) => {
      const name = rowValue(row, ".cap-process-name");
      return name.includes("爆品") && !name.includes("非爆品");
    });
  }
  return rows.find((row) => pair.keywords.some((keyword) => rowValue(row, ".cap-process-name").includes(keyword)));
}

function captureSharedData(scenario, existing = {}) {
  const shared = { ...existing };
  for (const pair of sharedFieldPairs) {
    const id = pair[scenario];
    const element = document.getElementById(id);
    if (element) shared[pair.key] = element.value;
  }
  shared.structureShares = { ...(shared.structureShares || {}) };
  if (scenario === "warehouse") {
    for (const pair of sharedStructurePairs) {
      shared.structureShares[pair.key] = value(pair.warehouse);
    }
  } else {
    document.querySelectorAll(".cap-structure-share").forEach((input) => {
      shared.structureShares[input.dataset.type] = input.value;
    });
  }
  shared.materialProfiles = { ...(shared.materialProfiles || {}) };
  document.querySelectorAll(`.material-profile-share[data-scenario="${scenario}"], .material-profile-filler[data-scenario="${scenario}"]`).forEach((input) => {
    const type = input.dataset.type;
    const material = input.dataset.material || "filler";
    if (!shared.materialProfiles[type]) shared.materialProfiles[type] = {};
    shared.materialProfiles[type][material] = input.value;
  });
  shared.processes = { ...(shared.processes || {}) };
  for (const pair of sharedProcessPairs) {
    if (scenario === "warehouse") {
      shared.processes[pair.key] = {
        rate: value(pair.warehouseRate),
        staff: value(pair.warehouseStaff)
      };
    } else {
      const row = findCapProcessRow(pair);
      if (row) {
        shared.processes[pair.key] = {
          rate: rowValue(row, ".cap-process-rate"),
          staff: rowValue(row, ".cap-process-staff")
        };
      }
    }
  }
  return shared;
}

function applySharedData(scenario, shared = {}) {
  document.querySelectorAll(`.material-profile-share[data-scenario="${scenario}"], .material-profile-filler[data-scenario="${scenario}"]`).forEach((input) => {
    const key = `${input.dataset.scenario}:${input.dataset.type}:${input.dataset.material || "filler"}`;
    if (initialMaterialProfileValues[key] !== undefined) input.value = initialMaterialProfileValues[key];
  });
  for (const pair of sharedFieldPairs) {
    const nextValue = shared[pair.key];
    if (nextValue === undefined) continue;
    const id = pair[scenario];
    if (document.getElementById(id)) setValue(id, nextValue);
  }
  for (const pair of sharedStructurePairs) {
    const nextValue = shared.structureShares?.[pair.key];
    if (nextValue === undefined) continue;
    if (scenario === "warehouse") {
      setValue(pair.warehouse, nextValue);
    } else {
      const input = document.querySelector(`.cap-structure-share[data-type="${pair.key}"]`);
      if (input) input.value = nextValue;
    }
  }
  for (const pair of sharedProcessPairs) {
    const process = shared.processes?.[pair.key];
    if (!process) continue;
    if (scenario === "warehouse") {
      setValue(pair.warehouseRate, process.rate);
      setValue(pair.warehouseStaff, process.staff);
    } else {
      const row = findCapProcessRow(pair);
      if (row) {
        const rateInput = row.querySelector(".cap-process-rate");
        const staffInput = row.querySelector(".cap-process-staff");
        if (rateInput && process.rate !== undefined) rateInput.value = process.rate;
        if (staffInput && process.staff !== undefined) staffInput.value = process.staff;
      }
    }
  }
  for (const [type, profile] of Object.entries(shared.materialProfiles || {})) {
    for (const [material, nextValue] of Object.entries(profile || {})) {
      const selector = material === "filler"
        ? `.material-profile-filler[data-scenario="${scenario}"][data-type="${type}"]`
        : `.material-profile-share[data-scenario="${scenario}"][data-type="${type}"][data-material="${material}"]`;
      const input = document.querySelector(selector);
      if (input) input.value = nextValue;
    }
  }
}

function createEmptyTemplateStore() {
  return {
    selectedId: "default",
    warehouses: {
      default: {
        name: defaultWarehouseName(),
        snapshots: {},
        shared: {}
      }
    }
  };
}

function findWarehouseIdByName(store, name) {
  const normalized = String(name || "").trim();
  return Object.entries(store.warehouses).find(([, template]) => template.name === normalized)?.[0] || "";
}

function migrateScenarioTemplates(targetStore, sourceStore, scenario) {
  if (!sourceStore?.warehouses) return;
  for (const [id, template] of Object.entries(sourceStore.warehouses)) {
    const name = id === "default" ? defaultWarehouseName() : template.name;
    const existingId = id === "default" ? "default" : findWarehouseIdByName(targetStore, name);
    const nextId = existingId || id;
    if (!targetStore.warehouses[nextId]) {
      targetStore.warehouses[nextId] = { name, snapshots: {}, shared: {} };
    }
    targetStore.warehouses[nextId].snapshots[scenario] = template.snapshot || null;
    targetStore.warehouses[nextId].shared = {
      ...(targetStore.warehouses[nextId].shared || {}),
      ...(template.shared || {})
    };
  }
  if (sourceStore.selectedId) {
    const selectedTemplate = sourceStore.warehouses[sourceStore.selectedId];
    const selectedName = sourceStore.selectedId === "default" ? defaultWarehouseName() : selectedTemplate?.name;
    const selectedId = findWarehouseIdByName(targetStore, selectedName) || "default";
    targetStore.selectedId = selectedId;
  }
}

function readTemplateStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(templateStoreKey) || "null");
    if (!parsed || typeof parsed !== "object") return createEmptyTemplateStore();
    if (parsed.warehouse || parsed.capacity) {
      const migrated = createEmptyTemplateStore();
      migrateScenarioTemplates(migrated, parsed.warehouse, "warehouse");
      migrateScenarioTemplates(migrated, parsed.capacity, "capacity");
      return migrated;
    }
    const store = parsed.warehouses ? parsed : createEmptyTemplateStore();
    if (!store.warehouses.default) {
      store.warehouses.default = { name: defaultWarehouseName(), snapshots: {}, shared: {} };
    }
    for (const template of Object.values(store.warehouses)) {
      if (!template.snapshots) template.snapshots = {};
      if (!template.shared) template.shared = {};
    }
    if (!store.selectedId || !store.warehouses[store.selectedId]) store.selectedId = "default";
    return store;
  } catch {
    return createEmptyTemplateStore();
  }
}

function writeTemplateStore(store) {
  localStorage.setItem(templateStoreKey, JSON.stringify(store));
}

function ensureInitialTemplates() {
  if (localStorage.getItem(templateStoreKey)) return;
  const store = readTemplateStore();
  let changed = false;
  const defaultTemplate = store.warehouses.default;
  for (const scenario of ["warehouse", "capacity"]) {
    if (!defaultTemplate.snapshots[scenario]) {
      defaultTemplate.snapshots[scenario] = captureTemplateSnapshot(scenario);
      changed = true;
    }
  }
  if (!Object.keys(defaultTemplate.shared || {}).length) {
    defaultTemplate.shared = captureSharedData(activeScenario(), defaultTemplate.shared);
    changed = true;
  }
  if (changed) writeTemplateStore(store);
}

function applyTemplateSnapshot(scenario, snapshot, shared) {
  if (!snapshot) snapshot = readTemplateStore().warehouses.default.snapshots[scenario];
  if (!snapshot) snapshot = { values: {}, html: {} };
  for (const [id, html] of Object.entries(snapshot.html || {})) {
    if (id === "capStructureInputRows") continue;
    const element = document.getElementById(id);
    if (element) element.innerHTML = html;
  }
  for (const [id, nextValue] of Object.entries(snapshot.values || {})) {
    setValue(id, nextValue);
  }
  if (scenario === "capacity") {
    let shares = snapshot.structureShares || null;
    if (!shares && snapshot.html?.capStructureInputRows) {
      const temp = document.createElement("div");
      temp.innerHTML = snapshot.html.capStructureInputRows;
      shares = {};
      temp.querySelectorAll(".cap-structure-share").forEach((input) => {
        shares[input.dataset.type] = input.value;
      });
    }
    for (const [type, nextValue] of Object.entries(shares || {})) {
      const input = document.querySelector(`.cap-structure-share[data-type="${type}"]`);
      if (input) input.value = nextValue;
    }
  }
  applySharedData(scenario, shared);
  latestWmsData = {};
  latestCapacityMonitor = {};
}

function syncWarehouseTemplateSelect() {
  const store = readTemplateStore();
  const select = document.getElementById("warehouseTemplate");
  if (!select) return;
  select.innerHTML = "";
  for (const [id, template] of Object.entries(store.warehouses)) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = template.name;
    select.appendChild(option);
  }
  select.value = store.selectedId;
}

function loadSelectedWarehouseTemplate(shouldCalculate = true) {
  const scenario = activeScenario();
  const store = readTemplateStore();
  const select = document.getElementById("warehouseTemplate");
  const selectedId = select?.value || store.selectedId;
  const template = store.warehouses[selectedId] || store.warehouses.default;
  const defaultTemplate = store.warehouses.default;
  store.selectedId = selectedId;
  writeTemplateStore(store);
  applyTemplateSnapshot(scenario, template.snapshots?.[scenario] || defaultTemplate.snapshots?.[scenario], template.shared);
  if (shouldCalculate) calculateActiveScenario();
}

function addWarehouseTemplate() {
  if (!ensureAdminAccess()) return;
  const scenario = activeScenario();
  const rawName = prompt("输入仓库名称");
  const name = rawName ? rawName.trim() : "";
  if (!name) return;
  const store = readTemplateStore();
  const id = findWarehouseIdByName(store, name) || `wh_${Date.now()}`;
  if (!store.warehouses[id]) {
    store.warehouses[id] = { name, snapshots: {}, shared: {} };
  }
  store.warehouses[id].snapshots[scenario] = captureTemplateSnapshot(scenario);
  store.warehouses[id].shared = captureSharedData(scenario, store.warehouses[id].shared);
  store.selectedId = id;
  writeTemplateStore(store);
  syncWarehouseTemplateSelect();
  loadSelectedWarehouseTemplate(true);
}

function saveWarehouseTemplate() {
  if (!ensureAdminAccess()) return;
  const scenario = activeScenario();
  const store = readTemplateStore();
  const selectedId = value("warehouseTemplate") || store.selectedId;
  const template = store.warehouses[selectedId];
  if (!template) return;
  template.snapshots[scenario] = captureTemplateSnapshot(scenario);
  template.shared = captureSharedData(scenario, template.shared);
  store.selectedId = selectedId;
  writeTemplateStore(store);
  const button = document.getElementById("saveTemplateBtn");
  if (button) {
    const oldHtml = button.innerHTML;
    button.innerHTML = `<span class="btn-icon" aria-hidden="true">✓</span>已保存`;
    setTimeout(() => {
      button.innerHTML = oldHtml;
    }, 1000);
  }
}

function ensureAdminAccess() {
  if (value("accountRole") !== "admin") return false;
  if (sessionStorage.getItem("dacuPrepAdminAuthed") === "1") return true;
  showLogin();
  return false;
}

function updateAccountControls() {
  const admin = value("accountRole") === "admin" && ensureAdminAccess();
  document.body.classList.toggle("role-guest", !admin);
  for (const element of document.querySelectorAll(".admin-only")) {
    element.disabled = !admin;
  }
  localStorage.setItem("dacuPrepAccountRole", value("accountRole"));
}

function thresholdRequired(forecast, explicitSafetyPercent = 0) {
  const mode = value("safetyThresholdMode");
  const threshold = Math.max(0, num("safetyThresholdValue"));
  const explicitRequired = forecast * (1 + explicitSafetyPercent);
  if (mode === "fixed") return Math.max(explicitRequired, forecast + threshold);
  const rate = clamp(threshold / 100, 0, 0.95);
  return Math.max(explicitRequired, forecast / Math.max(1 - rate, 0.05));
}

function tagClass(gap, ratio) {
  if (gap <= 0) return "tag-ok";
  if (ratio <= 0.18) return "tag-warn";
  return "tag-danger";
}

function tagText(gap, ratio) {
  if (gap <= 0) return "满足";
  if (ratio <= 0.18) return "偏紧";
  return "缺口";
}

function capacityStatus(item) {
  if (item.capacityGap > 0) return `${tagText(item.capacityGap, item.gapRatio)} ${fmt(item.capacityGap)}`;
  if (item.surplusStaff > 0) return `富余 ${fmt(item.surplusCapacity)}`;
  return "刚好满足";
}

function setPill(id, okText, warnText, hasWarn) {
  const tag = document.getElementById(id);
  tag.textContent = hasWarn ? warnText : okText;
  tag.style.color = hasWarn ? "#b45309" : "#047857";
  tag.style.background = hasWarn ? "#fff2c7" : "#dff8ec";
}

function makeListItem(text) {
  const li = document.createElement("li");
  li.textContent = text;
  return li;
}

function normalizeShares(rows, shareSelector) {
  const raw = rows.map((row) => ({
    ...row,
    rawShare: Math.max(0, num(shareSelector(row)))
  }));
  const sum = raw.reduce((total, row) => total + row.rawShare, 0);
  const divisor = sum > 0 ? sum : raw.length;
  return {
    rows: raw.map((row) => ({
      ...row,
      share: sum > 0 ? row.rawShare / divisor : 1 / raw.length
    })),
    sum
  };
}

function calculateStructure() {
  const forecastOrders = num("forecastOrders");
  const forecastShares = normalizeShares(structureTypes, (row) => row.forecastShareId);
  const historyShares = normalizeShares(structureTypes, (row) => row.historyShareId);
  const rows = forecastShares.rows.map((type) => {
    const orders = forecastOrders * type.share;
    const itemsPerOrder = Math.max(1, numOrDefault(type.itemsId, type.defaultItems));
    const skusPerOrder = Math.max(1, numOrDefault(type.skusId, type.defaultSkus));
    const packagesPerOrder = Math.max(0.1, numOrDefault(type.packagesId, type.defaultPackages));
    return {
      ...type,
      orders,
      itemsPerOrder,
      skusPerOrder,
      packagesPerOrder,
      items: orders * itemsPerOrder,
      lines: orders * skusPerOrder,
      packages: orders * packagesPerOrder
    };
  });

  const totals = rows.reduce((acc, row) => {
    acc.orders += row.orders;
    acc.items += row.items;
    acc.lines += row.lines;
    acc.packages += row.packages;
    acc.complexity += row.share * row.complexity;
    return acc;
  }, { orders: 0, items: 0, lines: 0, packages: 0, complexity: 0 });

  const historyComplexity = historyShares.rows.reduce((total, row) => total + row.share * row.complexity, 0);
  const structureShift = totals.complexity / Math.max(historyComplexity, 0.1);
  return {
    rows,
    totals,
    forecastShareSum: forecastShares.sum,
    historyShareSum: historyShares.sum,
    historyComplexity,
    structureShift
  };
}

function calculateHotSkus() {
  return [...document.querySelectorAll("#hotSkuRows .sku-input-row")].map((row, index) => {
    const name = rowValue(row, ".sku-name").trim() || `爆品${index + 1}`;
    const forecast = rowNumber(row, ".sku-forecast");
    const stock = rowNumber(row, ".sku-stock");
    const transit = rowNumber(row, ".sku-transit");
    const priority = rowNumber(row, ".sku-priority");
    const safety = rowNumber(row, ".sku-safety") / 100;
    const required = thresholdRequired(forecast, safety);
    const available = stock + priority;
    const gap = Math.max(0, required - available);
    return { name, forecast, stock, transit, priority, inbound: priority, safety, required, available, gap };
  }).filter((row) => row.forecast > 0 || row.available > 0);
}

function calculateSafetyStocks() {
  return [...document.querySelectorAll("#safetyStockRows .safety-input-row")].map((row, index) => {
    const name = rowValue(row, ".safety-name").trim() || `安全库存项${index + 1}`;
    const forecast = rowNumber(row, ".safety-forecast");
    const stock = rowNumber(row, ".safety-stock");
    const inbound = rowNumber(row, ".safety-inbound");
    const required = thresholdRequired(forecast);
    const available = stock + inbound;
    const gap = Math.max(0, required - available);
    return { name, forecast, stock, inbound, required, available, gap };
  }).filter((row) => row.forecast > 0 || row.available > 0);
}

function profileValue(scenario, type, material) {
  const selector = material === "filler"
    ? `.material-profile-filler[data-scenario="${scenario}"][data-type="${type}"]`
    : `.material-profile-share[data-scenario="${scenario}"][data-type="${type}"][data-material="${material}"]`;
  const parsed = Number(document.querySelector(selector)?.value || 0);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function calculateMaterials(structureRows, scenario = "warehouse") {
  const safety = 1 + pct("materialSafety");
  const packageTotals = Object.fromEntries(materialProfileMaterials.map((item) => [item.key, 0]));
  const profileRows = [];
  let totalPackages = 0;
  let fillerBase = 0;

  for (const row of structureRows) {
    const type = row.key;
    const typePackages = row.packages ?? row.pieces ?? 0;
    totalPackages += typePackages;
    const quantities = materialProfileMaterials.map((material) => ({
      ...material,
      quantity: profileValue(scenario, type, material.key)
    }));
    const quantitySum = quantities.reduce((sum, material) => sum + material.quantity, 0);
    for (const material of quantities) {
      packageTotals[material.key] += typePackages * material.quantity / 100;
    }
    const fillerQuantity = profileValue(scenario, type, "filler");
    fillerBase += typePackages * fillerQuantity / 100;
    profileRows.push({
      key: type,
      name: row.name,
      packages: typePackages,
      quantitySum,
      fillerQuantity
    });
  }

  const materials = materialRows.map((row) => {
    const needed = packageTotals[row.key] * safety;
    const stock = num(row.stockId);
    return {
      ...row,
      needed,
      stock,
      gap: Math.max(0, needed - stock)
    };
  });
  const labelNeeded = totalPackages * safety;
  const tapeNeeded = totalPackages / Math.max(num("tapeCoverage"), 1) * safety;
  materials.push({
    key: "label",
    name: "面单",
    unit: "张",
    needed: labelNeeded,
    stock: num("labelStock"),
    gap: Math.max(0, labelNeeded - num("labelStock"))
  });
  materials.push({
    key: "tape",
    name: "胶带",
    unit: "卷",
    needed: tapeNeeded,
    stock: num("tapeStock"),
    gap: Math.max(0, tapeNeeded - num("tapeStock"))
  });
  const fillerNeeded = fillerBase * safety;
  materials.push({
    key: "filler",
    name: "填充物",
    unit: "份",
    needed: fillerNeeded,
    stock: num("fillerStock"),
    gap: Math.max(0, fillerNeeded - num("fillerStock"))
  });
  return {
    materials,
    profileRows,
    mixWarnings: profileRows.filter((row) => row.quantitySum <= 0)
  };
}

function monitorNumber(...keys) {
  for (const key of keys) {
    if (typeof latestWmsData[key] === "number") return latestWmsData[key];
  }
  return null;
}

function calculateMonitorSnapshot(processes, structure) {
  const avgPickPieces = structure.totals.lines / Math.max(structure.totals.orders, 1);
  const avgItems = structure.totals.items / Math.max(structure.totals.orders, 1);
  const avgOutboundPieces = structure.totals.packages / Math.max(structure.totals.orders, 1);
  const hotShare = clamp(pct("hotSingleMultiShare"), 0, 1);
  const combinedCheckPackBacklog =
    monitorNumber("待复核打包件数", "待复核打包任务") ??
    (monitorNumber("待复核打包订单") !== null ? monitorNumber("待复核打包订单") * avgOutboundPieces : null) ??
    (((monitorNumber("待复核订单") ?? 0) + (monitorNumber("待打包订单") ?? 0)) * avgOutboundPieces);
  const hotCheckPackBacklog =
    monitorNumber("待爆品复核打包件数", "待爆品复核打包任务") ??
    (monitorNumber("待爆品复核打包订单") !== null ? monitorNumber("待爆品复核打包订单") * avgOutboundPieces : null) ??
    combinedCheckPackBacklog * hotShare;
  const normalCheckPackBacklog =
    monitorNumber("待非爆品复核打包件数", "待非爆品复核打包任务") ??
    (monitorNumber("待非爆品复核打包订单") !== null ? monitorNumber("待非爆品复核打包订单") * avgOutboundPieces : null) ??
    combinedCheckPackBacklog * (1 - hotShare);
  const backlogByProcess = {
    pick: monitorNumber("待拣件数", "待拣任务") ?? (monitorNumber("待拣订单") ?? 0) * avgPickPieces,
    hotCheckPack: hotCheckPackBacklog,
    normalCheckPack: normalCheckPackBacklog,
    ship: monitorNumber("待组发运件数", "待组发运任务", "待发货件数", "待发货任务") ??
      ((monitorNumber("待组发运订单", "待发货订单") ?? 0) * avgOutboundPieces)
  };
  const hasBacklog = Object.values(backlogByProcess).some((value) => value > 0);
  if (!hasBacklog) {
    return {
      available: false,
      bottleneck: null,
      rows: [],
      riskScore: null,
      riskLevel: "待判定"
    };
  }
  const rows = processes.map((process) => {
    const backlog = backlogByProcess[process.key] || 0;
    const hoursToClear = backlog / Math.max(process.capacity, 1);
    return {
      ...process,
      backlog,
      hoursToClear
    };
  });
  const bottleneck = rows.slice().sort((a, b) => b.hoursToClear - a.hoursToClear)[0];
  const abnormalSkus = monitorNumber("库存异常SKU", "异常SKU") || 0;
  const abnormalOrders = monitorNumber("异常订单", "超时订单", "拦截订单") || 0;
  const equipmentFaults = monitorNumber("设备故障", "故障设备") || 0;
  const maxHours = bottleneck.hoursToClear;
  const riskScore =
    (maxHours >= 2.5 ? 3 : maxHours >= 1.2 ? 2 : maxHours >= 0.6 ? 1 : 0) +
    (abnormalSkus >= 10 ? 2 : abnormalSkus > 0 ? 1 : 0) +
    (abnormalOrders >= 100 ? 2 : abnormalOrders > 0 ? 1 : 0) +
    (equipmentFaults > 0 ? 2 : 0);
  return {
    available: true,
    bottleneck,
    rows,
    riskScore,
    riskLevel: riskScore >= 5 ? "高" : riskScore >= 2 ? "中" : "低",
    abnormalSkus,
    abnormalOrders,
    equipmentFaults
  };
}

function calculate() {
  const historyPeakDayOrders = num("historyPeakDayOrders");
  const historyPeakHourOrders = num("historyPeakHourOrders");
  const historyExceptionRate = pct("historyExceptionRate");
  const historyReturnRate = pct("historyReturnRate");
  const campaignDays = Math.max(num("campaignDays"), 1);
  const peakDayShare = pct("peakDayShare");
  const peakHourShare = pct("peakHourShare");
  const workHours = Math.max(num("workHours"), 1);
  const bufferRate = Math.max(pct("bufferRate"), historyExceptionRate + historyReturnRate * 0.5);
  const structure = calculateStructure();
  const peakDay = {
    orders: structure.totals.orders * peakDayShare,
    items: structure.totals.items * peakDayShare,
    lines: structure.totals.lines * peakDayShare,
    packages: structure.totals.packages * peakDayShare
  };
  const peakHour = {
    orders: peakDay.orders * peakHourShare,
    items: peakDay.items * peakHourShare,
    lines: peakDay.lines * peakHourShare,
    packages: peakDay.packages * peakHourShare
  };
  const demandMultiplier = 1 + bufferRate;
  const complexityPenalty = 1 + Math.max(0, structure.structureShift - 1) * 0.18;
  const singleMultiRow = structure.rows.find((row) => row.key === "singleMulti");
  const hotSingleMultiShare = clamp(pct("hotSingleMultiShare"), 0, 1);
  const hotCheckPackBase = (singleMultiRow ? singleMultiRow.packages : 0) * peakDayShare * peakHourShare * hotSingleMultiShare;
  const normalCheckPackBase = Math.max(0, peakHour.packages - hotCheckPackBase);
  const demands = {
    pick: peakHour.lines * demandMultiplier,
    hotCheckPack: hotCheckPackBase * demandMultiplier,
    normalCheckPack: normalCheckPackBase * demandMultiplier * complexityPenalty,
    ship: peakHour.packages * demandMultiplier
  };
  const hotSkus = calculateHotSkus();
  const safetyStocks = calculateSafetyStocks();
  const materialResult = calculateMaterials(structure.rows, "warehouse");
  const processes = [
    { key: "pick", name: "拣货", unit: "件/h", rate: num("pickRate"), staff: num("pickStaff"), required: demands.pick },
    { key: "hotCheckPack", name: "爆品复核打包", unit: "件/h", rate: num("hotCheckPackRate"), staff: num("hotCheckPackStaff"), required: demands.hotCheckPack },
    { key: "normalCheckPack", name: "非爆品复核打包", unit: "件/h", rate: num("normalCheckPackRate"), staff: num("normalCheckPackStaff"), required: demands.normalCheckPack },
    { key: "ship", name: "组发运", unit: "件/h", rate: num("shipRate"), staff: num("shipStaff"), required: demands.ship }
  ].map((process) => {
    const capacity = process.rate * process.staff;
    const neededStaff = Math.ceil(process.required / Math.max(process.rate, 1));
    const staffGap = Math.max(0, neededStaff - process.staff);
    const surplusCapacity = Math.max(0, capacity - process.required);
    const surplusStaff = Math.max(0, process.staff - neededStaff);
    const capacityGap = Math.max(0, process.required - capacity);
    const gapRatio = capacityGap / Math.max(process.required, 1);
    return { ...process, capacity, neededStaff, staffGap, surplusCapacity, surplusStaff, capacityGap, gapRatio };
  });
  const bottleneck = processes.slice().sort((a, b) => b.gapRatio - a.gapRatio || b.capacityGap - a.capacityGap)[0];
  const monitor = calculateMonitorSnapshot(processes, structure);
  const totalStaffGap = processes.reduce((sum, item) => sum + item.staffGap, 0);
  const availableStaffCover = num("tempStaffPool") + num("backupStaff");
  const pdaNeeded = processes[0].neededStaff + processes[3].neededStaff;
  const pdaGap = Math.max(0, pdaNeeded - num("pdaCount"));
  const printerNeeded = Math.ceil(demands.normalCheckPack / Math.max(num("printerRate"), 1));
  const printerGap = Math.max(0, printerNeeded - num("printerCount"));
  const pickNeededStaff = processes[0].neededStaff;
  const pickEquipmentAvailable =
    num("orderpickerCount") * Math.max(num("orderpickerStaffCoverage"), 1) +
    num("riderCount") * Math.max(num("riderStaffCoverage"), 1) +
    num("forkliftCount") * Math.max(num("forkliftStaffCoverage"), 1);
  const pickEquipmentNeeded = pickNeededStaff;
  const pickEquipmentGap = Math.max(0, pickEquipmentNeeded - pickEquipmentAvailable);
  const reservePressure = num("equipmentReserve") < 8;
  const peakGrowth = peakHour.orders / Math.max(historyPeakHourOrders, 1);
  const dailyGrowth = peakDay.orders / Math.max(historyPeakDayOrders, 1);
  const skuGapCount = hotSkus.filter((sku) => sku.gap > 0).length;
  const safetyGapCount = safetyStocks.filter((item) => item.gap > 0).length;
  const materialGapCount = materialResult.materials.filter((item) => item.gap > 0).length;
  const materialMixWarningCount = materialResult.mixWarnings.length;
  const equipmentGapCount = pdaGap + printerGap + pickEquipmentGap;
  const severeProcessGaps = processes.filter((item) => item.gapRatio > 0.18).length;
  const structureRisk = structure.structureShift > 1.08;
  const riskScore =
    severeProcessGaps * 2 +
    (totalStaffGap > availableStaffCover ? 2 : 0) +
    (equipmentGapCount > 0 ? 1 : 0) +
    materialGapCount +
    materialMixWarningCount +
    skuGapCount * 2 +
    safetyGapCount +
    (peakGrowth > 1.2 ? 1 : 0) +
    (dailyGrowth > 1.2 ? 1 : 0) +
    (reservePressure ? 1 : 0) +
    (structureRisk ? 1 : 0);
  const planningRiskScore = riskScore;
  const riskLevel = monitor.available ? monitor.riskLevel : "待判定";
  const result = {
    historyPeakDayOrders,
    historyPeakHourOrders,
    campaignDays,
    bufferRate,
    structure,
    peakDay,
    peakHour,
    demands,
    hotSkus,
    safetyStocks,
    materials: materialResult.materials,
    materialProfiles: materialResult.profileRows,
    materialMixWarnings: materialResult.mixWarnings,
    processes,
    bottleneck,
    monitor,
    totalStaffGap,
    availableStaffCover,
    pdaNeeded,
    pdaGap,
    printerNeeded,
    printerGap,
    pickEquipmentNeeded,
    pickEquipmentAvailable,
    pickEquipmentGap,
    reservePressure,
    peakGrowth,
    dailyGrowth,
    skuGapCount,
    safetyGapCount,
    materialGapCount,
    materialMixWarningCount,
    equipmentGapCount,
    planningRiskScore,
    riskScore: monitor.available ? monitor.riskScore : null,
    riskLevel,
    workHours
  };
  latestResult = result;
  renderAll(result);
  latestReport = buildReport(result);
}

function renderAll(result) {
  renderSummary(result);
  renderStructure(result.structure);
  renderHotSkus(result.hotSkus);
  renderSafetyStocks(result.safetyStocks);
  renderCapacity(result.processes);
  renderEquipment(result);
  renderConsumables(result.materials);
  renderActions(result);
  renderWatch(result);
  renderWms();
}

function renderSummary(result) {
  document.getElementById("metricPackages").textContent = `${fmt(result.structure.totals.packages)} 件`;
  document.getElementById("metricPeakHour").textContent = `${fmt(Math.max(...Object.values(result.demands)))} /h`;
  document.getElementById("metricBottleneck").textContent =
    result.monitor.available ? result.monitor.bottleneck.name : "待监控输入";
  document.getElementById("metricCapacityRate").textContent =
    `${one(result.bottleneck.capacity / Math.max(result.bottleneck.required, 1) * 100)}%`;
  document.getElementById("metricRisk").textContent =
    result.monitor.available ? `${result.riskLevel}风险` : "待监控输入";
}

function renderStructure(structure) {
  const tbody = document.getElementById("structureRows");
  tbody.innerHTML = "";
  for (const row of structure.rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${row.name}</strong></td>
      <td>${fmt(row.orders)}</td>
      <td>${fmt(row.items)}</td>
      <td>${fmt(row.lines)}</td>
      <td>${fmt(row.packages)}</td>
    `;
    tbody.appendChild(tr);
  }
  const sumWarn = Math.abs(structure.forecastShareSum - 100) > 0.5;
  const shiftWarn = structure.structureShift > 1.08;
  const tag = document.getElementById("structureTag");
  tag.textContent = sumWarn
    ? `占比合计${one(structure.forecastShareSum)}%，已自动归一`
    : shiftWarn
      ? `复杂度较历史 +${one((structure.structureShift - 1) * 100)}%`
      : "结构正常";
  tag.style.color = sumWarn || shiftWarn ? "#b45309" : "#047857";
  tag.style.background = sumWarn || shiftWarn ? "#fff2c7" : "#dff8ec";
}

function renderHotSkus(skus) {
  const tbody = document.getElementById("skuRows");
  tbody.innerHTML = "";
  for (const sku of skus) {
    const ratio = sku.gap / Math.max(sku.required, 1);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${sku.name}</strong></td>
      <td>${fmt(sku.required)}</td>
      <td>${fmt(sku.available)}</td>
      <td><span class="${tagClass(sku.gap, ratio)}">${fmt(sku.gap)}</span></td>
      <td>${hotSkuStatus(sku)}</td>
    `;
    tbody.appendChild(tr);
  }
  setPill("skuTag", "库存安全", `风险SKU ${skus.filter((sku) => sku.gap > 0).length} 个`, skus.some((sku) => sku.gap > 0));
}

function hotSkuStatus(sku) {
  if (sku.required <= sku.stock) return "无需处理";
  if (sku.required <= sku.stock + sku.priority) return "优先上架";
  return "调拨";
}

function renderSafetyStocks(stocks) {
  const tbody = document.getElementById("safetyRows");
  tbody.innerHTML = "";
  for (const item of stocks) {
    const ratio = item.gap / Math.max(item.required, 1);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>${fmt(item.required)}</td>
      <td>${fmt(item.available)}</td>
      <td><span class="${tagClass(item.gap, ratio)}">${fmt(item.gap)}</span></td>
      <td>${item.gap > 0 ? "低于阈值" : "安全"}</td>
    `;
    tbody.appendChild(tr);
  }
  setPill("safetyTag", "安全库存满足", `低于阈值 ${stocks.filter((item) => item.gap > 0).length} 项`, stocks.some((item) => item.gap > 0));
}

function renderCapacity(processes) {
  const tbody = document.getElementById("capacityRows");
  tbody.innerHTML = "";
  for (const item of processes) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>${fmt(item.required)} ${item.unit}</td>
      <td>${fmt(item.capacity)} ${item.unit}</td>
      <td><span class="${tagClass(item.capacityGap, item.gapRatio)}">${capacityStatus(item)}</span></td>
      <td>${item.staffGap > 0 ? `补 ${item.staffGap} 人` : item.surplusStaff > 0 ? `可调出 ${item.surplusStaff} 人` : "维持当前班表"}</td>
    `;
    tbody.appendChild(tr);
  }
  setPill("capacityTag", "产能满足", "存在缺口", processes.some((item) => item.capacityGap > 0));
}

function renderEquipment(result) {
  const list = document.getElementById("equipmentList");
  list.innerHTML = "";
  const pickStaff = result.processes.find((item) => item.key === "pick")?.neededStaff || 0;
  const shipStaff = result.processes.find((item) => item.key === "ship")?.neededStaff || 0;
  const pdaAvailable = num("pdaCount");
  const items = [
    result.pdaGap > 0
      ? `PDA（拣货 ${pickStaff} + 组发运 ${shipStaff}）需 ${result.pdaNeeded} 台，现有 ${pdaAvailable} 台，缺 ${result.pdaGap} 台`
      : `PDA（拣货 ${pickStaff} + 组发运 ${shipStaff}）需 ${result.pdaNeeded} 台，现有 ${pdaAvailable} 台，当前满足`,
    result.printerGap > 0
      ? `面单打印机需 ${result.printerNeeded} 台，缺 ${result.printerGap} 台`
      : `面单打印机需 ${result.printerNeeded} 台，当前满足`,
    result.pickEquipmentGap > 0
      ? `拣货设备合计（对应拣货 ${result.pickEquipmentNeeded} 人）需 ${result.pickEquipmentNeeded} 台，可用 ${result.pickEquipmentAvailable} 台，缺 ${result.pickEquipmentGap} 台`
      : `拣货设备合计（对应拣货 ${result.pickEquipmentNeeded} 人）需 ${result.pickEquipmentNeeded} 台，可用 ${result.pickEquipmentAvailable} 台，当前满足`,
    result.reservePressure ? "备用设备比例偏低，建议准备可替换设备" : "备用设备比例满足"
  ];
  for (const text of items) list.appendChild(makeListItem(text));
}

function renderConsumables(materials) {
  const list = document.getElementById("consumableList");
  list.innerHTML = "";
  for (const item of materials) {
    const text = item.gap > 0
      ? `${item.name}需 ${fmt(item.needed)}${item.unit}，缺 ${fmt(item.gap)}${item.unit}`
      : `${item.name}需 ${fmt(item.needed)}${item.unit}，库存满足`;
    list.appendChild(makeListItem(text));
  }
}

function renderActions(result) {
  const actions = [];
  const surplusPools = result.processes
    .filter((item) => item.surplusStaff > 0)
    .map((item) => ({ ...item, movable: item.surplusStaff }));
  const shortagePools = result.processes
    .filter((item) => item.staffGap > 0)
    .map((item) => ({ ...item, remaining: item.staffGap }));
  const multiShare = result.structure.rows
    .filter((row) => row.key === "multiSingle" || row.key === "multiMulti")
    .reduce((sum, row) => sum + row.share, 0);
  if (multiShare > 0.35) {
    actions.push(`订单结构偏复杂：多品订单占 ${one(multiShare * 100)}%，拣货件数和非爆品复核打包压力高于总订单视角，建议按多品波次单独排产。`);
  }
  for (const shortage of shortagePools) {
    for (const surplus of surplusPools) {
      if (shortage.remaining <= 0 || surplus.movable <= 0) continue;
      const moveCount = Math.min(shortage.remaining, surplus.movable);
      actions.push(`人员调配：${surplus.name}富余 ${surplus.surplusStaff} 人，建议先调 ${moveCount} 人到${shortage.name}，再判断是否需要外部补强。`);
      shortage.remaining -= moveCount;
      surplus.movable -= moveCount;
    }
  }
  for (const item of result.processes) {
    const remainingGap = shortagePools.find((pool) => pool.key === item.key)?.remaining ?? item.staffGap;
    if (remainingGap > 0) {
      actions.push(`${item.name}补强：内部调配后仍需补 ${remainingGap} 人，或通过加班/外包覆盖 ${fmt(item.capacityGap)} ${item.unit} 缺口。`);
    }
  }
  const remainingTotalGap = shortagePools.reduce((sum, item) => sum + item.remaining, 0);
  if (remainingTotalGap > result.availableStaffCover) {
    actions.push(`人员缺口超过可补池：内部调配后仍缺 ${remainingTotalGap} 人，可补 ${result.availableStaffCover} 人，建议提前锁定外包或拆分峰值波次。`);
  } else if (remainingTotalGap > 0) {
    actions.push(`人员可覆盖：内部调配后仍缺 ${remainingTotalGap} 人，可由临时工和替补人员池覆盖。`);
  }
  for (const sku of result.hotSkus.filter((item) => item.gap > 0)) {
    actions.push(`爆品库存：${sku.name} 缺 ${fmt(sku.gap)} 件，优先做仓内调拨、到货确认或活动限量。`);
  }
  for (const item of result.safetyStocks.filter((entry) => entry.gap > 0)) {
    actions.push(`安全库存：${item.name} 低于阈值，缺 ${fmt(item.gap)} 件，建议补货、移库或降低预测出库占用。`);
  }
  if (result.pdaGap > 0) actions.push(`设备补强：追加 PDA ${result.pdaGap} 台，仅保障拣货和组发运岗位。`);
  if (result.printerGap > 0) actions.push(`设备补强：非爆品复核打包追加打印机 ${result.printerGap} 台，面单打印区设置备用机。`);
  if (result.pickEquipmentGap > 0) actions.push(`拣货设备补强：Orderpicker、Rider、Forklift 合计缺 ${result.pickEquipmentGap} 台，按实际库区补对应设备类型。`);
  for (const item of result.materials.filter((entry) => entry.gap > 0)) {
    actions.push(`耗材补货：${item.name}至少补 ${fmt(item.gap)}${item.unit}，优先按峰值日前 1 天到仓。`);
  }
  for (const item of result.materialMixWarnings.slice(0, 4)) {
    actions.push(`耗材用量预警：${item.name}未配置纸箱/包装袋数量，系统无法给该件型分摊外包装需求。`);
  }
  if (result.peakGrowth > 1.2) actions.push("峰值小时高于历史 20% 以上，建议爆品前置、预处理、提前打印波次单。");
  if (result.dailyGrowth > 1.2) actions.push("峰值日订单高于历史 20% 以上，建议把高动销 SKU 调整到近拣货位。");
  if (result.monitor.available) {
    actions.push(`现场节奏：按监控瓶颈 ${result.monitor.bottleneck.name} 建立小时看板，每 1 小时复盘一次缺口和异常闭环。`);
  } else {
    actions.push("现场节奏：先导入 WMS/监控快照，再判定实时瓶颈工序和风险等级。");
  }

  const list = document.getElementById("actionList");
  list.innerHTML = "";
  for (const text of actions.slice(0, 12)) {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  }
}

function renderWatch(result) {
  const watch = [
    {
      label: "订单复杂度",
      value: `${one(result.structure.totals.complexity)} / 历史${one(result.structure.historyComplexity)}`,
      pct: clamp(result.structure.structureShift * 70, 0, 100),
      color: result.structure.structureShift > 1.08 ? "#dc2626" : "#2563eb"
    },
    {
      label: "监控瓶颈负载",
      value: result.monitor.available
        ? `${result.monitor.bottleneck.name} ${one(result.monitor.bottleneck.hoursToClear)}小时待清`
        : "待导入WMS快照",
      pct: result.monitor.available ? clamp(result.monitor.bottleneck.hoursToClear / 3 * 100, 0, 100) : 0,
      color: result.monitor.available
        ? result.monitor.bottleneck.hoursToClear >= 1.2 ? "#dc2626" : "#059669"
        : "#94a3b8"
    },
    {
      label: "人员覆盖率",
      value: `${result.totalStaffGap > 0 ? one(result.availableStaffCover / result.totalStaffGap * 100) : 100}%`,
      pct: result.totalStaffGap > 0 ? clamp(result.availableStaffCover / result.totalStaffGap * 100, 0, 100) : 100,
      color: result.totalStaffGap > result.availableStaffCover ? "#dc2626" : "#059669"
    },
    {
      label: "爆品风险SKU",
      value: `${result.skuGapCount} 个`,
      pct: clamp((4 - result.skuGapCount) / 4 * 100, 0, 100),
      color: result.skuGapCount ? "#dc2626" : "#059669"
    },
    {
      label: "安全库存阈值风险",
      value: `${result.safetyGapCount} 项`,
      pct: clamp((6 - result.safetyGapCount) / 6 * 100, 0, 100),
      color: result.safetyGapCount ? "#dc2626" : "#059669"
    },
    {
      label: "耗材缺口项",
      value: `${result.materialGapCount} 项`,
      pct: clamp((10 - result.materialGapCount) / 10 * 100, 0, 100),
      color: result.materialGapCount ? "#d97706" : "#059669"
    },
    {
      label: "综合风险分",
      value: result.monitor.available ? `${result.riskScore} 分` : "待监控输入",
      pct: result.monitor.available ? clamp(result.riskScore / 8 * 100, 0, 100) : 0,
      color: result.monitor.available
        ? result.riskScore >= 5 ? "#dc2626" : result.riskScore >= 2 ? "#d97706" : "#059669"
        : "#94a3b8"
    }
  ];
  const grid = document.getElementById("watchGrid");
  grid.innerHTML = "";
  for (const item of watch) {
    const div = document.createElement("div");
    div.className = "watch-item";
    div.innerHTML = `
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <div class="bar"><i style="--value:${item.pct}%; --bar-color:${item.color}"></i></div>
    `;
    grid.appendChild(div);
  }
}

function parseWmsSnapshot(text) {
  const data = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/[,，:\t]/).map((part) => part.trim()).filter(Boolean);
    if (parts.length < 2) continue;
    const key = parts[0];
    const rawValue = parts.slice(1).join("");
    const numeric = Number(rawValue.replace(/[^\d.-]/g, ""));
    data[key] = Number.isFinite(numeric) ? numeric : rawValue;
  }
  return data;
}

function importWmsSnapshot() {
  latestWmsData = parseWmsSnapshot(value("wmsSnapshot"));
  const mappings = {
    "PDA在线": "pdaCount",
    "打印机在线": "printerCount",
    "Orderpicker在线": "orderpickerCount",
    "Rider在线": "riderCount",
    "Forklift在线": "forkliftCount",
    "纸箱S": "cartonSStock",
    "纸箱M": "cartonMStock",
    "纸箱L": "cartonLStock",
    "纸箱XL": "cartonXLStock",
    "包装袋S": "bagSStock",
    "包装袋M": "bagMStock",
    "包装袋L": "bagLStock",
    "包装袋XL": "bagXLStock",
    "面单": "labelStock",
    "胶带": "tapeStock",
    "填充物": "fillerStock"
  };
  for (const [key, id] of Object.entries(mappings)) {
    if (typeof latestWmsData[key] === "number") setValue(id, latestWmsData[key]);
  }
  for (const row of document.querySelectorAll("#hotSkuRows .sku-input-row")) {
    const name = rowValue(row, ".sku-name").trim();
    if (!name) continue;
    if (typeof latestWmsData[`${name}可用`] === "number") row.querySelector(".sku-stock").value = latestWmsData[`${name}可用`];
    if (typeof latestWmsData[`${name}库存`] === "number") row.querySelector(".sku-stock").value = latestWmsData[`${name}库存`];
    if (typeof latestWmsData[`${name}在途`] === "number") row.querySelector(".sku-transit").value = latestWmsData[`${name}在途`];
    if (typeof latestWmsData[`${name}在途库存`] === "number") row.querySelector(".sku-transit").value = latestWmsData[`${name}在途库存`];
    if (typeof latestWmsData[`${name}可优先上架`] === "number") row.querySelector(".sku-priority").value = latestWmsData[`${name}可优先上架`];
    if (typeof latestWmsData[`${name}优先上架`] === "number") row.querySelector(".sku-priority").value = latestWmsData[`${name}优先上架`];
    if (typeof latestWmsData[`${name}到货`] === "number") row.querySelector(".sku-priority").value = latestWmsData[`${name}到货`];
  }
  for (const row of document.querySelectorAll("#safetyStockRows .safety-input-row")) {
    const name = rowValue(row, ".safety-name").trim();
    if (!name) continue;
    if (typeof latestWmsData[`${name}可用`] === "number") row.querySelector(".safety-stock").value = latestWmsData[`${name}可用`];
    if (typeof latestWmsData[`${name}库存`] === "number") row.querySelector(".safety-stock").value = latestWmsData[`${name}库存`];
    if (typeof latestWmsData[`${name}到货`] === "number") row.querySelector(".safety-inbound").value = latestWmsData[`${name}到货`];
  }
  calculate();
}

function renderWms() {
  const status = document.getElementById("wmsStatus");
  const grid = document.getElementById("wmsGrid");
  grid.innerHTML = "";
  const entries = Object.entries(latestWmsData);
  status.textContent = entries.length ? `已导入 ${entries.length} 项` : "未导入";
  status.style.color = entries.length ? "#047857" : "#64748b";
  status.style.background = entries.length ? "#dff8ec" : "#eef4ff";
  for (const [key, val] of entries.slice(0, 12)) {
    const div = document.createElement("div");
    div.className = "wms-item";
    div.innerHTML = `<span>${key}</span><strong>${typeof val === "number" ? fmt(val) : val}</strong>`;
    grid.appendChild(div);
  }
}

function parseKeyValueText(text) {
  const data = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/[,，:\t]/).map((part) => part.trim()).filter(Boolean);
    if (parts.length < 2) continue;
    const key = parts[0];
    const rawValue = parts.slice(1).join("");
    const numeric = Number(rawValue.replace(/[^\d.-]/g, ""));
    data[key] = Number.isFinite(numeric) ? numeric : rawValue;
  }
  return data;
}

function capNum(id) {
  const parsed = Number(value(id));
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateCapacityStructure() {
  const peakOrders = capNum("capPeakOrders");
  const rawRows = capacityStructureTypes.map((type) => {
    const shareInput = document.querySelector(`.cap-structure-share[data-type="${type.key}"]`);
    const rawShare = Number(shareInput?.value || 0);
    const share = Number.isFinite(rawShare) ? Math.max(0, rawShare) : 0;
    return { ...type, rawShare: share };
  });
  const shareSum = rawRows.reduce((sum, row) => sum + row.rawShare, 0);
  const rows = rawRows.map((row) => {
    const share = shareSum > 0 ? row.rawShare / shareSum : 0;
    const orders = peakOrders * share;
    const pieces = orders * row.itemsPerOrder;
    return { ...row, share, orders, pieces };
  });
  const singleMulti = rows.find((row) => row.key === "singleMulti");
  const hotShare = clamp(capNum("capHotSingleMultiShare") / 100, 0, 1);
  const hotPieces = (singleMulti?.pieces || 0) * hotShare;
  const totalPieces = rows.reduce((sum, row) => sum + row.pieces, 0);
  return {
    rows,
    shareSum,
    hotShare,
    hotPieces,
    normalPieces: Math.max(0, totalPieces - hotPieces),
    totals: {
      orders: peakOrders,
      pieces: totalPieces
    }
  };
}

function getCapacityDemandForProcess(name, share, demandBase, demands) {
  if (name.includes("非爆品")) return demands.normalCheckPack;
  if (name.includes("爆品")) return demands.hotCheckPack;
  if (name.includes("拣货")) return demands.pick;
  if (name.includes("组发运") || name.includes("发运")) return demands.ship;
  return demandBase * share;
}

function getCapacityProcessRows(structure = calculateCapacityStructure()) {
  const demandMultiplier = 1 + capNum("capBufferRate") / 100;
  const demandBase = structure.totals.pieces * demandMultiplier;
  const demands = {
    pick: demandBase,
    hotCheckPack: structure.hotPieces * demandMultiplier,
    normalCheckPack: structure.normalPieces * demandMultiplier,
    ship: demandBase
  };
  return [...document.querySelectorAll("#capProcessRows .cap-process-input-row")].map((row, index) => {
    const name = rowValue(row, ".cap-process-name").trim() || `工序${index + 1}`;
    const share = Math.max(0, rowNumber(row, ".cap-process-share")) / 100;
    const rate = Math.max(1, rowNumber(row, ".cap-process-rate"));
    const staff = Math.max(0, rowNumber(row, ".cap-process-staff"));
    const required = getCapacityDemandForProcess(name, share, demandBase, demands);
    const capacity = rate * staff;
    const neededStaff = Math.ceil(required / rate);
    const staffGap = Math.max(0, neededStaff - staff);
    const surplusStaff = Math.max(0, staff - neededStaff);
    const capacityGap = Math.max(0, required - capacity);
    const surplusCapacity = Math.max(0, capacity - required);
    const gapRatio = capacityGap / Math.max(required, 1);
    return { name, share, rate, staff, required, capacity, neededStaff, staffGap, surplusStaff, capacityGap, surplusCapacity, gapRatio };
  });
}

function findProcess(rows, keyword) {
  return rows.find((row) => row.name.includes(keyword));
}

function getCapMonitorValue(name, data) {
  return data[`${name}待处理件数`] ?? data[`待${name}件数`] ?? data[name] ?? 0;
}

function calculateCapacityMonitor(rows) {
  const data = latestCapacityMonitor;
  const hasData = Object.keys(data).length > 0;
  if (!hasData) return { available: false, rows: [], bottleneck: null, riskLevel: "待判定", riskScore: null };
  const monitorRows = rows.map((row) => {
    const backlog = Number(getCapMonitorValue(row.name, data)) || 0;
    return {
      ...row,
      backlog,
      hoursToClear: backlog / Math.max(row.capacity, 1)
    };
  });
  const bottleneck = monitorRows.slice().sort((a, b) => b.hoursToClear - a.hoursToClear)[0];
  const abnormalOrders = Number(data["异常订单"] || 0);
  const equipmentFaults = Number(data["设备故障"] || 0);
  const maxHours = bottleneck ? bottleneck.hoursToClear : 0;
  const riskScore =
    (maxHours >= 2.5 ? 3 : maxHours >= 1.2 ? 2 : maxHours >= 0.6 ? 1 : 0) +
    (abnormalOrders >= 100 ? 2 : abnormalOrders > 0 ? 1 : 0) +
    (equipmentFaults > 0 ? 2 : 0);
  return {
    available: true,
    rows: monitorRows,
    bottleneck,
    riskScore,
    riskLevel: riskScore >= 5 ? "高" : riskScore >= 2 ? "中" : "低"
  };
}

function calculateCapacityModel() {
  const structure = calculateCapacityStructure();
  const rows = getCapacityProcessRows(structure);
  if (!rows.length) return;
  const materialResult = calculateMaterials(structure.rows, "capacity");
  const pick = findProcess(rows, "拣货");
  const ship = findProcess(rows, "组发运") || findProcess(rows, "发运");
  const normalCheckPack = findProcess(rows, "非爆品");
  const pdaNeeded = (pick?.neededStaff || 0) + (ship?.neededStaff || 0);
  const pdaGap = Math.max(0, pdaNeeded - capNum("capPdaCount"));
  const printerNeeded = Math.ceil((normalCheckPack?.required || 0) / Math.max(capNum("capPrinterRate"), 1));
  const printerGap = Math.max(0, printerNeeded - capNum("capPrinterCount"));
  const pickNeededStaff = pick?.neededStaff || 0;
  const pickEquipmentAvailable =
    capNum("capOrderpickerCount") * Math.max(capNum("capOrderpickerCoverage"), 1) +
    capNum("capRiderCount") * Math.max(capNum("capRiderCoverage"), 1) +
    capNum("capForkliftCount") * Math.max(capNum("capForkliftCoverage"), 1);
  const pickEquipmentNeeded = pickNeededStaff;
  const pickEquipmentGap = Math.max(0, pickEquipmentNeeded - pickEquipmentAvailable);
  const bottleneck = rows.slice().sort((a, b) => b.gapRatio - a.gapRatio || b.capacityGap - a.capacityGap)[0];
  const monitor = calculateCapacityMonitor(rows);
  const result = {
    structure,
    rows,
    bottleneck,
    monitor,
    pdaNeeded,
    pdaGap,
    printerNeeded,
    printerGap,
    pickEquipmentNeeded,
    pickEquipmentAvailable,
    pickEquipmentGap,
    materials: materialResult.materials,
    materialGapCount: materialResult.materials.filter((item) => item.gap > 0).length,
    materialMixWarnings: materialResult.mixWarnings
  };
  renderCapacityModel(result);
}

function renderCapacityModel(result) {
  document.getElementById("capMetricDemand").textContent = `${fmt(result.structure.totals.pieces * (1 + capNum("capBufferRate") / 100))} 件/h`;
  document.getElementById("capMetricPlanBottleneck").textContent = result.bottleneck?.name || "-";
  document.getElementById("capMetricMonitorBottleneck").textContent = result.monitor.available ? result.monitor.bottleneck.name : "待监控输入";
  document.getElementById("capMetricRisk").textContent = result.monitor.available ? `${result.monitor.riskLevel}风险` : "待监控输入";
  renderCapStructure(result.structure);
  renderCapProcessRows(result.rows);
  renderCapDevices(result);
  renderCapConsumables(result);
  renderCapActions(result);
  renderCapMonitor(result.monitor);
}

function renderCapStructure(structure) {
  const tbody = document.getElementById("capStructureRows");
  tbody.innerHTML = "";
  for (const row of structure.rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${row.name}</strong></td>
      <td>${fmt(row.orders)}</td>
      <td>${fmt(row.pieces)}</td>
      <td>${one(row.share * 100)}%</td>
    `;
    tbody.appendChild(tr);
  }
  const tag = document.getElementById("capStructureTag");
  const shareWarn = Math.abs(structure.shareSum - 100) > 0.5;
  tag.textContent = shareWarn
    ? `占比合计${one(structure.shareSum)}%，已自动归一`
    : `爆品件数 ${fmt(structure.hotPieces)}，非爆品件数 ${fmt(structure.normalPieces)}`;
  tag.style.color = shareWarn ? "#b45309" : "#047857";
  tag.style.background = shareWarn ? "#fff2c7" : "#dff8ec";
}

function renderCapProcessRows(rows) {
  const tbody = document.getElementById("capProcessOutputRows");
  tbody.innerHTML = "";
  for (const row of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${row.name}</strong></td>
      <td>${fmt(row.required)} 件/h</td>
      <td>${fmt(row.capacity)} 件/h</td>
      <td><span class="${tagClass(row.capacityGap, row.gapRatio)}">${capacityStatus(row)}</span></td>
      <td>${row.staffGap > 0 ? `补 ${row.staffGap} 人` : row.surplusStaff > 0 ? `可调出 ${row.surplusStaff} 人` : "维持当前班表"}</td>
    `;
    tbody.appendChild(tr);
  }
  setPill("capBalanceTag", "产能满足", "存在缺口", rows.some((row) => row.capacityGap > 0));
}

function renderCapDevices(result) {
  const list = document.getElementById("capDeviceList");
  const pickStaff = findProcess(result.rows, "拣货")?.neededStaff || 0;
  const shipStaff = (findProcess(result.rows, "组发运") || findProcess(result.rows, "发运"))?.neededStaff || 0;
  const pdaAvailable = capNum("capPdaCount");
  const items = [
    result.pdaGap > 0
      ? `PDA（拣货 ${pickStaff} + 组发运 ${shipStaff}）需 ${result.pdaNeeded} 台，现有 ${pdaAvailable} 台，缺 ${result.pdaGap} 台`
      : `PDA（拣货 ${pickStaff} + 组发运 ${shipStaff}）需 ${result.pdaNeeded} 台，现有 ${pdaAvailable} 台，当前满足`,
    result.printerGap > 0 ? `面单打印机需 ${result.printerNeeded} 台，缺 ${result.printerGap} 台` : `面单打印机需 ${result.printerNeeded} 台，当前满足`,
    result.pickEquipmentGap > 0
      ? `拣货设备合计（对应拣货 ${result.pickEquipmentNeeded} 人）需 ${result.pickEquipmentNeeded} 台，可用 ${result.pickEquipmentAvailable} 台，缺 ${result.pickEquipmentGap} 台`
      : `拣货设备合计（对应拣货 ${result.pickEquipmentNeeded} 人）需 ${result.pickEquipmentNeeded} 台，可用 ${result.pickEquipmentAvailable} 台，当前满足`
  ];
  list.innerHTML = "";
  for (const item of items) list.appendChild(makeListItem(item));
}

function renderCapConsumables(result) {
  const list = document.getElementById("capConsumableList");
  if (!list) return;
  list.innerHTML = "";
  for (const item of result.materials) {
    const text = item.gap > 0
      ? `${item.name}需 ${fmt(item.needed)}${item.unit}，缺 ${fmt(item.gap)}${item.unit}`
      : `${item.name}需 ${fmt(item.needed)}${item.unit}，库存满足`;
    list.appendChild(makeListItem(text));
  }
  for (const item of result.materialMixWarnings.slice(0, 4)) {
    list.appendChild(makeListItem(`${item.name}未配置纸箱/包装袋数量`));
  }
}

function renderCapActions(result) {
  const actions = [];
  const surplusPools = result.rows.filter((row) => row.surplusStaff > 0).map((row) => ({ ...row, movable: row.surplusStaff }));
  const shortagePools = result.rows.filter((row) => row.staffGap > 0).map((row) => ({ ...row, remaining: row.staffGap }));
  for (const shortage of shortagePools) {
    for (const surplus of surplusPools) {
      if (shortage.remaining <= 0 || surplus.movable <= 0) continue;
      const moveCount = Math.min(shortage.remaining, surplus.movable);
      actions.push(`人员调配：从${surplus.name}调 ${moveCount} 人到${shortage.name}。`);
      shortage.remaining -= moveCount;
      surplus.movable -= moveCount;
    }
  }
  for (const shortage of shortagePools.filter((row) => row.remaining > 0)) {
    actions.push(`${shortage.name}内部调配后仍缺 ${shortage.remaining} 人，可从可补人员池、加班或外包补强。`);
  }
  if (result.pdaGap > 0) actions.push(`设备补强：PDA 仅给拣货和组发运使用，需补 ${result.pdaGap} 台。`);
  if (result.printerGap > 0) actions.push(`设备补强：面单打印机需补 ${result.printerGap} 台。`);
  if (result.pickEquipmentGap > 0) actions.push(`拣货设备补强：Orderpicker、Rider、Forklift 合计需补 ${result.pickEquipmentGap} 台，按库区实际缺口补对应设备。`);
  for (const item of result.materials.filter((entry) => entry.gap > 0)) {
    actions.push(`耗材补货：${item.name}缺 ${fmt(item.gap)}${item.unit}，按SKU件型耗材比例补齐。`);
  }
  for (const item of result.materialMixWarnings.slice(0, 4)) {
    actions.push(`耗材用量预警：${item.name}未配置纸箱/包装袋数量，无法给该件型分摊外包装需求。`);
  }
  if (!actions.length) actions.push("预测产能满足，建议保留当前班表并持续导入监控快照观察实时队列。");
  const list = document.getElementById("capActionList");
  list.innerHTML = "";
  for (const action of actions.slice(0, 10)) {
    const li = document.createElement("li");
    li.textContent = action;
    list.appendChild(li);
  }
}

function renderCapMonitor(monitor) {
  const status = document.getElementById("capMonitorStatus");
  const tbody = document.getElementById("capMonitorRows");
  tbody.innerHTML = "";
  status.textContent = monitor.available ? `已导入，${monitor.riskLevel}风险` : "未导入";
  status.style.color = monitor.available ? "#047857" : "#64748b";
  status.style.background = monitor.available ? "#dff8ec" : "#eef4ff";
  if (!monitor.available) return;
  for (const row of monitor.rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${row.name}</strong></td>
      <td>${fmt(row.backlog)} 件</td>
      <td>${fmt(row.capacity)} 件/h</td>
      <td>${one(row.hoursToClear)} 小时</td>
    `;
    tbody.appendChild(tr);
  }
}

function importCapacityMonitor() {
  latestCapacityMonitor = parseKeyValueText(value("capMonitorSnapshot"));
  calculateCapacityModel();
}

function buildCapacityReport() {
  const structure = calculateCapacityStructure();
  const rows = getCapacityProcessRows(structure);
  const monitor = calculateCapacityMonitor(rows);
  const materialResult = calculateMaterials(structure.rows, "capacity");
  const structureLines = structure.rows
    .map((row) => `- ${row.name}：订单 ${fmt(row.orders)}，件数 ${fmt(row.pieces)}，占比 ${one(row.share * 100)}%`)
    .join("\n");
  const processLines = rows
    .map((row) => `- ${row.name}：需求 ${fmt(row.required)} 件/h，当前产能 ${fmt(row.capacity)} 件/h，缺口 ${fmt(row.capacityGap)}，富余 ${fmt(row.surplusCapacity)}`)
    .join("\n");
  const monitorLines = monitor.available
    ? monitor.rows.map((row) => `- ${row.name}：待处理 ${fmt(row.backlog)} 件，预计 ${one(row.hoursToClear)} 小时清空`).join("\n")
    : "- 未导入监控快照，暂不判断实时瓶颈与实时风险";
  const materialLines = materialResult.materials
    .map((item) => `- ${item.name}：需求 ${fmt(item.needed)}${item.unit}，库存 ${fmt(item.stock)}${item.unit}，缺口 ${fmt(item.gap)}${item.unit}`)
    .join("\n");
  const materialProfileLines = materialResult.profileRows
    .map((item) => `- ${item.name}：件数 ${fmt(item.packages)}，每100件外包装数量 ${one(item.quantitySum)} 个，填充物 ${one(item.fillerQuantity)} 份`)
    .join("\n");
  return [
    "产能模型测算报告",
    "",
    "一、模型参数",
    `- 模型名称：${value("capModelName")}`,
    `- 峰值小时订单数：${fmt(capNum("capPeakOrders"))}`,
    `- 峰值小时作业件数：${fmt(structure.totals.pieces)}`,
    `- 需求缓冲：${one(capNum("capBufferRate"))}%`,
    "",
    "二、订单结构",
    structureLines,
    `- 单品多件中爆品件数：${fmt(structure.hotPieces)}`,
    `- 非爆品件数：${fmt(structure.normalPieces)}`,
    "",
    "三、工序产能",
    processLines,
    "",
    "四、SKU件型耗材用量",
    materialProfileLines,
    "",
    "五、耗材约束",
    materialLines,
    "",
    "六、实时监控",
    monitorLines,
    "",
    "七、实时判断",
    monitor.available ? `- 实时瓶颈：${monitor.bottleneck.name}` : "- 实时瓶颈：待监控输入",
    monitor.available ? `- 实时风险：${monitor.riskLevel}风险` : "- 实时风险：待监控输入"
  ].join("\n");
}

function addCapacityProcessRow() {
  const container = document.getElementById("capProcessRows");
  const nextIndex = container.querySelectorAll(".cap-process-input-row").length + 1;
  const label = document.createElement("label");
  label.className = "capacity-process-row cap-process-input-row";
  label.innerHTML = `
    <input class="cap-process-name" type="text" value="新增工序${nextIndex}">
    <input class="cap-process-share" type="number" min="0" step="0.1" value="100">
    <input class="cap-process-rate" type="number" min="1" value="100">
    <input class="cap-process-staff" type="number" min="0" value="0">
    <button class="icon-btn" type="button" data-remove-cap-process>×</button>
  `;
  container.appendChild(label);
  calculateCapacityModel();
}

function buildReport(result) {
  const structureLines = result.structure.rows
    .map((row) => `- ${row.name}：订单 ${fmt(row.orders)}，商品件数 ${fmt(row.items)}，拣货件数 ${fmt(row.lines)}，出库件数 ${fmt(row.packages)}`)
    .join("\n");
  const skuLines = result.hotSkus
    .map((sku) => `- ${sku.name}：安全需求 ${fmt(sku.required)}，仓内 ${fmt(sku.stock)}，在途 ${fmt(sku.transit)}，可优先上架 ${fmt(sku.priority)}，缺口 ${fmt(sku.gap)}，状态 ${hotSkuStatus(sku)}`)
    .join("\n");
  const safetyLines = result.safetyStocks
    .map((item) => `- ${item.name}：阈值需求 ${fmt(item.required)}，仓内+到货 ${fmt(item.available)}，缺口 ${fmt(item.gap)}`)
    .join("\n");
  const processLines = result.processes
    .map((item) => `- ${item.name}：需求 ${fmt(item.required)} ${item.unit}，当前 ${fmt(item.capacity)} ${item.unit}，缺口 ${fmt(item.capacityGap)}，建议补 ${item.staffGap} 人`)
    .join("\n");
  const materialLines = result.materials
    .map((item) => `- ${item.name}：需求 ${fmt(item.needed)}${item.unit}，库存 ${fmt(item.stock)}${item.unit}，缺口 ${fmt(item.gap)}${item.unit}`)
    .join("\n");
  const materialProfileLines = result.materialProfiles
    .map((item) => `- ${item.name}：出库件数 ${fmt(item.packages)}，每100件外包装数量 ${one(item.quantitySum)} 个，填充物 ${one(item.fillerQuantity)} 份`)
    .join("\n");
  const pickStaff = result.processes.find((item) => item.key === "pick")?.neededStaff || 0;
  const shipStaff = result.processes.find((item) => item.key === "ship")?.neededStaff || 0;

  return [
    "大促准备模型测算报告 V2",
    "",
    "一、订单结构测算",
    structureLines,
    `- 预测订单结构复杂度：${one(result.structure.totals.complexity)}，历史复杂度：${one(result.structure.historyComplexity)}`,
    "",
    "二、需求测算",
    `- 预测总订单：${fmt(result.structure.totals.orders)}`,
    `- 预测商品件数：${fmt(result.structure.totals.items)}`,
    `- 预测拣货件数：${fmt(result.structure.totals.lines)}`,
    `- 预测出库件数：${fmt(result.structure.totals.packages)}`,
    `- 峰值小时订单：${fmt(result.peakHour.orders)}`,
    `- 峰值小时拣货件数：${fmt(result.peakHour.lines)}`,
    `- 峰值小时商品件数：${fmt(result.peakHour.items)}`,
    `- 峰值小时出库件数：${fmt(result.peakHour.packages)}`,
    "",
    "三、爆品库存安全",
    skuLines,
    "",
    "四、安全库存项",
    safetyLines,
    "",
    "五、产能缺口",
    processLines,
    "",
    "六、设备缺口",
    `- PDA（拣货 ${pickStaff} + 组发运 ${shipStaff}）：需 ${result.pdaNeeded} 台，现有 ${num("pdaCount")} 台，缺 ${result.pdaGap} 台`,
    `- 面单打印机：需 ${result.printerNeeded} 台，缺 ${result.printerGap} 台`,
    `- 拣货设备合计（Orderpicker / Rider / Forklift，对应拣货 ${result.pickEquipmentNeeded} 人）：需 ${result.pickEquipmentNeeded} 台，可用 ${result.pickEquipmentAvailable} 台，缺 ${result.pickEquipmentGap} 台`,
    "",
    "七、SKU件型耗材用量",
    materialProfileLines,
    "",
    "八、耗材缺口",
    materialLines,
    "",
    "九、风险判断",
    result.monitor.available
      ? `- 实时瓶颈工序：${result.monitor.bottleneck.name}，待清时长 ${one(result.monitor.bottleneck.hoursToClear)} 小时`
      : "- 实时瓶颈工序：未导入 WMS/监控快照，暂不判定",
    `- 人员总缺口：${result.totalStaffGap} 人，可补池：${result.availableStaffCover} 人`,
    `- 风险 SKU：${result.skuGapCount} 个`,
    `- 安全库存阈值风险：${result.safetyGapCount} 项`,
    `- 耗材缺口项：${result.materialGapCount} 项`,
    result.monitor.available
      ? `- 综合风险等级：${result.riskLevel}`
      : "- 综合风险等级：未导入 WMS/监控快照，暂不判定"
  ].join("\n");
}

function exportReport() {
  if (value("scenario") === "capacity") {
    const blob = new Blob([buildCapacityReport()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "产能模型测算报告.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return;
  }
  if (!latestReport) calculate();
  const blob = new Blob([latestReport], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "大促准备测算报告V2.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function updateScenarioTitle() {
  const scenario = value("scenario");
  const title = document.getElementById("appTitle");
  const eyebrow = document.getElementById("appEyebrow");
  const warehouseInput = document.getElementById("warehouseInputView");
  const capacityInput = document.getElementById("capacityInputView");
  const warehouseOutput = document.getElementById("warehouseOutputView");
  const capacityOutput = document.getElementById("capacityOutputView");
  syncWarehouseTemplateSelect();
  loadSelectedWarehouseTemplate(false);
  updateAccountControls();
  if (scenario === "capacity") {
    title.textContent = "产能模型测算台";
    eyebrow.textContent = "订单结构 + 现场产能 + 设备人员耗材";
    warehouseInput.classList.add("is-hidden");
    warehouseOutput.classList.add("is-hidden");
    capacityInput.classList.remove("is-hidden");
    capacityOutput.classList.remove("is-hidden");
    calculateCapacityModel();
  } else {
    title.textContent = "大促准备模型测算台 V2";
    eyebrow.textContent = "订单结构 + 爆品库存 + 现场资源";
    warehouseInput.classList.remove("is-hidden");
    warehouseOutput.classList.remove("is-hidden");
    capacityInput.classList.add("is-hidden");
    capacityOutput.classList.add("is-hidden");
    calculate();
  }
}

function calculateActiveScenario() {
  if (value("scenario") === "capacity") calculateCapacityModel();
  else calculate();
}

function resetForm() {
  for (const [id, nextValue] of Object.entries(initialValues)) {
    setValue(id, nextValue);
  }
  for (const [id, html] of Object.entries(initialDynamicHtml)) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = html;
  }
  document.querySelectorAll(".material-profile-share, .material-profile-filler").forEach((input) => {
    const key = `${input.dataset.scenario}:${input.dataset.type}:${input.dataset.material || "filler"}`;
    if (initialMaterialProfileValues[key] !== undefined) input.value = initialMaterialProfileValues[key];
  });
  latestWmsData = {};
  latestCapacityMonitor = {};
  updateScenarioTitle();
}

function addSkuRow() {
  const container = document.getElementById("hotSkuRows");
  const nextIndex = container.querySelectorAll(".sku-input-row").length + 1;
  const label = document.createElement("label");
  label.className = "sku-row sku-row-action sku-input-row";
  label.innerHTML = `
    <input class="sku-name" type="text" value="爆品${nextIndex}">
    <input class="sku-forecast" type="number" min="0" value="0">
    <input class="sku-stock" type="number" min="0" value="0">
    <input class="sku-transit" type="number" min="0" value="0">
    <input class="sku-priority" type="number" min="0" value="0">
    <input class="sku-safety" type="number" min="0" step="0.1" value="8">
    <button class="icon-btn" type="button" data-remove-row>×</button>
  `;
  container.appendChild(label);
  calculate();
}

function addSafetyRow() {
  const container = document.getElementById("safetyStockRows");
  const nextIndex = container.querySelectorAll(".safety-input-row").length + 1;
  const label = document.createElement("label");
  label.className = "safety-row safety-row-action safety-input-row";
  label.innerHTML = `
    <input class="safety-name" type="text" value="安全库存项${nextIndex}">
    <input class="safety-forecast" type="number" min="0" value="0">
    <input class="safety-stock" type="number" min="0" value="0">
    <input class="safety-inbound" type="number" min="0" value="0">
    <button class="icon-btn" type="button" data-remove-row>×</button>
  `;
  container.appendChild(label);
  calculate();
}

function removeDynamicRow(button) {
  const row = button.closest(".sku-input-row, .safety-input-row");
  if (!row) return;
  const container = row.parentElement;
  if (container.children.length <= 1) {
    row.querySelectorAll("input").forEach((input) => {
      input.value = input.type === "text" ? "" : "0";
    });
  } else {
    row.remove();
  }
  calculate();
}

document.getElementById("calculateBtn").addEventListener("click", calculateActiveScenario);
document.getElementById("calculateInputBtn").addEventListener("click", calculateActiveScenario);
document.getElementById("exportBtn").addEventListener("click", exportReport);
document.getElementById("resetBtn").addEventListener("click", resetForm);
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("loginPassword").addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("importWmsBtn").addEventListener("click", importWmsSnapshot);
document.getElementById("addSkuBtn").addEventListener("click", addSkuRow);
document.getElementById("addSafetyBtn").addEventListener("click", addSafetyRow);
document.getElementById("importCapMonitorBtn").addEventListener("click", importCapacityMonitor);
document.getElementById("addCapProcessBtn").addEventListener("click", addCapacityProcessRow);
document.getElementById("accountRole").addEventListener("change", updateAccountControls);
document.getElementById("warehouseTemplate").addEventListener("change", loadSelectedWarehouseTemplate);
document.getElementById("addWarehouseBtn").addEventListener("click", addWarehouseTemplate);
document.getElementById("saveTemplateBtn").addEventListener("click", saveWarehouseTemplate);

document.querySelector(".input-panel").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-row]");
  if (button) removeDynamicRow(button);
  const capButton = event.target.closest("[data-remove-cap-process]");
  if (capButton) {
    const row = capButton.closest(".cap-process-input-row");
    if (row && row.parentElement.children.length > 1) row.remove();
    calculateCapacityModel();
  }
});

document.querySelector(".input-panel").addEventListener("input", (event) => {
  if (event.target.matches("#hotSkuRows input, #safetyStockRows input")) calculate();
  if (event.target.matches('.material-profile-share[data-scenario="warehouse"], .material-profile-filler[data-scenario="warehouse"]')) calculate();
  if (event.target.matches('.material-profile-share[data-scenario="capacity"], .material-profile-filler[data-scenario="capacity"]')) calculateCapacityModel();
  if (event.target.matches("#capacityInputView input, #capacityInputView textarea")) calculateCapacityModel();
});

for (const id of inputIds) {
  if (id === "scenario") continue;
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener("change", calculate);
    element.addEventListener("input", calculate);
  }
}

document.getElementById("scenario").addEventListener("change", updateScenarioTitle);
ensureInitialTemplates();
const sessionRole = sessionStorage.getItem(loginSessionKey);
if (sessionRole === "guest" || sessionRole === "admin") enterApp(sessionRole);
else showLogin();
