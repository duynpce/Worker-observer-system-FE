import { test } from "vitest";


test("ci test should should fail", () => {
  throw new Error("This test should fail");
}); 