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
import {
  isLogRequestCatalogItem,
  logRequestCatalogItemIds,
  logRequestPurgeGraceHours,
} from "@config/logRequestConfig";

describe("logRequestConfig", () => {
  let original: typeof window.config;

  beforeEach(() => {
    original = window.config;
    window.config = { ...(original ?? {}) } as typeof window.config;
  });

  afterEach(() => {
    window.config = original;
  });

  describe("logRequestCatalogItemIds / isLogRequestCatalogItem", () => {
    it("treats no request as a log request when the key is unset or empty", () => {
      expect(logRequestCatalogItemIds()).toEqual([]);
      expect(isLogRequestCatalogItem("item-1")).toBe(false);

      window.config.CSM_PORTAL_LOG_REQUEST_CATALOG_ITEM_IDS = [];
      expect(isLogRequestCatalogItem("item-1")).toBe(false);

      window.config.CSM_PORTAL_LOG_REQUEST_CATALOG_ITEM_IDS = " , ";
      expect(logRequestCatalogItemIds()).toEqual([]);
    });

    it("reads an array of ids", () => {
      window.config.CSM_PORTAL_LOG_REQUEST_CATALOG_ITEM_IDS = ["item-1", " item-2 "];
      expect(logRequestCatalogItemIds()).toEqual(["item-1", "item-2"]);
      expect(isLogRequestCatalogItem("item-2")).toBe(true);
      expect(isLogRequestCatalogItem("item-3")).toBe(false);
    });

    it("reads one comma-separated string, for platforms that inject strings", () => {
      window.config.CSM_PORTAL_LOG_REQUEST_CATALOG_ITEM_IDS = "item-1, item-2";
      expect(isLogRequestCatalogItem("item-1")).toBe(true);
      expect(isLogRequestCatalogItem("item-2")).toBe(true);
    });

    it("never matches a missing catalog item", () => {
      window.config.CSM_PORTAL_LOG_REQUEST_CATALOG_ITEM_IDS = ["item-1"];
      expect(isLogRequestCatalogItem(undefined)).toBe(false);
      expect(isLogRequestCatalogItem(null)).toBe(false);
      expect(isLogRequestCatalogItem("")).toBe(false);
    });
  });

  describe("logRequestPurgeGraceHours", () => {
    it("is 0 (deleted on close) when unset or not a positive number", () => {
      expect(logRequestPurgeGraceHours()).toBe(0);
      for (const value of [0, -5, "", "abc", "  "]) {
        window.config.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS = value;
        expect(logRequestPurgeGraceHours()).toBe(0);
      }
    });

    it("reads a number or a numeric string, in whole hours", () => {
      window.config.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS = 48;
      expect(logRequestPurgeGraceHours()).toBe(48);
      window.config.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS = " 24 ";
      expect(logRequestPurgeGraceHours()).toBe(24);
      window.config.CSM_PORTAL_LOG_REQUEST_PURGE_GRACE_HOURS = 1.9;
      expect(logRequestPurgeGraceHours()).toBe(1);
    });
  });
});
