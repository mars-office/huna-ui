import i18n from '../../src/i18n';

import { describe, it, expect } from "vitest";


describe("i18n", () => {
  it("Should be initialized with english language", () => {
    expect(i18n.language).toBe('en-US');
  });
});