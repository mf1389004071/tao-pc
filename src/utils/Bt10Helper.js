import cache from "@/plugins/cache";
import { getBt10Enums, getBt10Status } from "@/api/bt10/common";

// 整体缓存 key：分别存放 Enums 与 Status 的完整响应
const BT10_ENUMS_CACHE_KEY = "bt10_enums_cache_all";
const BT10_STATUS_CACHE_KEY = "bt10_status_cache_all";

// Enums / Status 内部类全名常量（集中导出，避免各页面硬编码字符串）
export const BT10_ENUM_KEYS = {
  EVENT_JOIN_TYPE: "com.geek.tao.bt10.common.Enums$EventJoinType",
  EVENT_TYPE: "com.geek.tao.bt10.common.Enums$EventType",
  STATUS: "com.geek.tao.bt10.common.Enums$Status"
};

export const BT10_STATUS_KEYS = {
  EVENT: "com.geek.tao.bt10.common.Status$Event"
};

function mapEnumToOptions(enumMap) {
  return Object.entries(enumMap || {}).map(([code, desc]) => ({
    value: code,
    label: desc
  }));
}

function getEnumsCache() {
  return cache.local.getJSON(BT10_ENUMS_CACHE_KEY) || {};
}

function getStatusCache() {
  return cache.local.getJSON(BT10_STATUS_CACHE_KEY) || {};
}

// 控制只触发一次后端请求的 Promise（防止多次并发调用）
let enumsRefreshPromise = null;
let statusRefreshPromise = null;

/**
 * 刷新所有 bt10 Enums 枚举（一次请求，全部缓存到本地）。
 */
export function refreshBt10Enums() {
  if (!enumsRefreshPromise) {
    enumsRefreshPromise = getBt10Enums().then(res => {
      const data = res.data || {};
      cache.local.setJSON(BT10_ENUMS_CACHE_KEY, data);
      return data;
    }).finally(() => {
      enumsRefreshPromise = null;
    });
  }
  return enumsRefreshPromise;
}

/**
 * 刷新所有 bt10 Status 业务状态（一次请求，全部缓存到本地）。
 */
export function refreshBt10Status() {
  if (!statusRefreshPromise) {
    statusRefreshPromise = getBt10Status().then(res => {
      const data = res.data || {};
      cache.local.setJSON(BT10_STATUS_CACHE_KEY, data);
      return data;
    }).finally(() => {
      statusRefreshPromise = null;
    });
  }
  return statusRefreshPromise;
}

/**
 * 根据枚举 key 从本地缓存中获取 options（若缓存不存在则返回空数组）。
 * @param enumKey 完整类名 key（如 BT10_ENUM_KEYS.EVENT_TYPE）
 * @param fromStatus 是否从 Status 缓存中取（默认 false，表示从 Enums 取）
 */
export function getBt10OptionsFromCache(enumKey, fromStatus = false) {
  const all = fromStatus ? getStatusCache() : getEnumsCache();
  return mapEnumToOptions(all[enumKey]);
}

/**
 * 页面初始化时调用：确保 Enums & Status 数据已加载并缓存在本地。
 * 返回 Promise<void>，供调用方统一等待后再从缓存按 key 读取。
 */
export function ensureBt10EnumsAndStatusLoaded() {
  return Promise.all([refreshBt10Enums(), refreshBt10Status()]).then(() => {});
}

