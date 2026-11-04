// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/**
 * Service requests raised from a log-request catalog item (e.g. "Component
 * Log Request") get their log bundle collected into storage by the log
 * collection automation, which deletes it again once the request is closed.
 * Closing one of these asks the engineer to confirm the logs were retrieved
 * first (see `ResolutionDialog`'s `logRetrievalWarning`).
 *
 * Both keys are read from `window.config` at call time (not module load,
 * unlike `apiConfig.ts`) so a test can set them per case; the values are fixed
 * for a real page load anyway.
 */

/**
 * Catalog item ids whose service requests are log requests, from
 * `CSM_PORTAL_LOG_REQUEST_CATALOG_ITEM_IDS`: an array of ids, or one
 * comma-separated string for platforms that inject config as strings. The ids
 * differ per environment. Unset or empty means no request is treated as a log
 * request, so the close dialog is unchanged.
 */
export function logRequestCatalogItemIds(): string[] {
  const raw = window.config?.CSM_PORTAL_LOG_REQUEST_CATALOG_ITEM_IDS;
  const parts = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : [];
  return parts
    .filter((id): id is string => typeof id === "string")
    .map((id) => id.trim())
    .filter((id) => id !== "");
}

/** Whether a service request's catalog item is one of the log-request items. */
export function isLogRequestCatalogItem(catalogItemId: string | null | undefined): boolean {
  if (!catalogItemId) return false;
  return logRequestCatalogItemIds().includes(catalogItemId);
}

/**
 * How many hours after a log request closes its bundle is deleted, from
 * `CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS` (a number, or a numeric string).
 * Must match the grace period the log collection automation is configured
 * with, since the close dialog quotes it. Unset, zero, negative or not a number
 * means 0: the bundle is deleted as soon as the request closes.
 */
export function logRequestPurgeGraceHours(): number {
  const raw = window.config?.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS;
  const hours =
    typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
  return Number.isFinite(hours) && hours > 0 ? Math.floor(hours) : 0;
}
