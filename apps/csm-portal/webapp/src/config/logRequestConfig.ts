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
 * A Component Log Request's logs are collected into storage by the log
 * collection automation, which deletes them a grace period after the request
 * closes. Closing one asks the engineer to confirm the logs were downloaded
 * first (see `ResolutionDialog`'s `logRetrievalWarning`).
 *
 * The grace period is read from `window.config` at call time (not module load,
 * unlike `apiConfig.ts`) so a test can set it per case; the value is fixed for
 * a real page load anyway.
 */

/**
 * The tag the CSM backend puts on a service request when it starts the log
 * collection pipeline for it. A Postgres service request does not keep its
 * catalog item, so this tag is what marks it as a log request; the backend
 * keys the deletion on close on the same label.
 */
export const LOG_REQUEST_TAG = "component-log-request";

/** Whether a case's tags mark it as a log request. */
export function isLogRequest(tags: readonly { label: string }[] | null | undefined): boolean {
  return (tags ?? []).some((t) => t.label === LOG_REQUEST_TAG);
}

const DEFAULT_PURGE_GRACE_HOURS = 48;

/**
 * How many hours after a log request closes its logs are deleted, from
 * `CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS` (a number, or a numeric string).
 * Must match the log collection automation's `PURGE_GRACE_HOURS`, since the
 * close dialog quotes it. Unset, negative or not a number means 48, the
 * automation's default; 0 means the logs are deleted as soon as it closes.
 */
export function logRequestPurgeGraceHours(): number {
  const raw = window.config?.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS;
  const hours =
    typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
  return Number.isFinite(hours) && hours >= 0 ? Math.floor(hours) : DEFAULT_PURGE_GRACE_HOURS;
}
