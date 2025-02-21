import "@alloy-js/core/testing";
import { expect, it } from "vitest";
import {
  render,
  Output,
  OutputDirectory,
  refkey,
  SourceDirectory,
  SourceFile,
} from "@alloy-js/core";
import * as ts from "../src/components/index.js";
import { d } from "@alloy-js/core/testing";

it("exports everything from source files within it", () => {
  const res = render(
    <Output>
      <ts.SourceFile path="test1.ts" />
      <ts.SourceFile path="test2.ts" />
      <SourceDirectory path="components">
        <ts.SourceFile path="c1.ts" />
        <ts.SourceFile path="c2.ts" />
        <ts.BarrelFile />
      </SourceDirectory>
      <ts.BarrelFile />
    </Output>
  );
  expect((res.contents[2].contents[2] as any).contents).toBe(d`
    export * from "./c1.js";
    export * from "./c2.js";
  `);

  expect(res.contents[3].contents).toBe(d`
    export * from "./test1.js";
    export * from "./test2.js";
    export * from "./components/index.js";
  `);
});

it("ignores non-TS files", () => {
  const res = render(
    <Output>
      <SourceFile path="test.txt" filetype="text" />
      <ts.SourceFile path="test1.ts" />
      <ts.SourceFile path="test2.ts" />
      <ts.BarrelFile />
    </Output>
  );

  expect(res.contents[3].contents).toBe(d`
    export * from "./test1.js";
    export * from "./test2.js";
  `);
});
