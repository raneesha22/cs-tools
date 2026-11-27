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

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isLogRequest, LOG_REQUEST_TAG, logRequestPurgeGraceHours } from "@config/logRequestConfig";

describe("logRequestConfig", () => {
  let original: typeof window.config;

  beforeEach(() => {
    original = window.config;
    window.config = { ...(original ?? {}) } as typeof window.config;
  });

  afterEach(() => {
    window.config = original;
  });

  describe("isLogRequest", () => {
    it("matches the tag the CSM backend adds", () => {
      expect(LOG_REQUEST_TAG).toBe("component-log-request");
      expect(isLogRequest([{ label: "urgent" }, { label: "component-log-request" }])).toBe(true);
    });

    it("matches nothing else", () => {
      expect(isLogRequest([{ label: "urgent" }])).toBe(false);
      expect(isLogRequest([{ label: "Component-Log-Request" }])).toBe(false);
      expect(isLogRequest([])).toBe(false);
      expect(isLogRequest(null)).toBe(false);
      expect(isLogRequest(undefined)).toBe(false);
    });
  });

  describe("logRequestPurgeGraceHours", () => {
    it("is 48 (the automation's default) when unset or not a number", () => {
      expect(logRequestPurgeGraceHours()).toBe(48);
      for (const value of [-5, "", "abc", "  "]) {
        window.config.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS = value;
        expect(logRequestPurgeGraceHours()).toBe(48);
      }
    });

    it("is 0 (deleted on close) when set to 0", () => {
      window.config.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS = 0;
      expect(logRequestPurgeGraceHours()).toBe(0);
      window.config.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS = "0";
      expect(logRequestPurgeGraceHours()).toBe(0);
    });

    it("reads a number or a numeric string, in whole hours", () => {
      window.config.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS = 72;
      expect(logRequestPurgeGraceHours()).toBe(72);
      window.config.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS = " 24 ";
      expect(logRequestPurgeGraceHours()).toBe(24);
      window.config.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS = 1.9;
      expect(logRequestPurgeGraceHours()).toBe(1);
    });
  });
});
