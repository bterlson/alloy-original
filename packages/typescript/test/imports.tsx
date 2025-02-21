import "@alloy-js/core/testing";
import { expect, it } from "vitest";
import {
  render,
  Output,
  SourceFile,
  Declaration,
  OutputDirectory,
  SourceDirectory,
  refkey,
} from "@alloy-js/core";
import * as ts from "../src/components/index.js";
import { Reference } from "../src/components/Reference.js";

it("works with default imports", () => {
  let obj = {};
  const res = render(
    <Output>
      <ts.SourceFile path="test1.ts">
        <ts.FunctionDeclaration export default name="asdf" refkey={refkey("test")} />
      </ts.SourceFile>

      <ts.SourceFile path="test2.ts">
        const v = <Reference refkey={refkey("test")} />;
      </ts.SourceFile>
    </Output>
  );

  printOutput(res);
});

it("works with named imports", () => {
  const res = render(
    <Output>
      <ts.SourceFile path="test1.ts">
        <ts.FunctionDeclaration export name="test" />
      </ts.SourceFile>

      <ts.SourceFile path="test2.ts">
        const v = <Reference refkey={refkey("test")} />;
      </ts.SourceFile>
    </Output>
  );

  printOutput(res);
});

it("works with default and named imports", () => {
  const res = render(
    <Output>
      <ts.SourceFile path="test1.ts">
        <ts.FunctionDeclaration export default name="test1" />
        <ts.FunctionDeclaration export name="test2" />
      </ts.SourceFile>

      <ts.SourceFile path="test2.ts">
        const v1 = <Reference refkey={refkey("test1")} />;
        const v2 = <Reference refkey={refkey("test2")} />;
      </ts.SourceFile>
    </Output>
  );

  printOutput(res);
});

it("works with default and named imports and name conflicts", () => {
  const res = render(
    <Output>
      <ts.SourceFile path="test1.ts">
        <ts.FunctionDeclaration export default name="test1">
          console.log("foo");
        </ts.FunctionDeclaration>
        <ts.FunctionDeclaration export name="test2" />
      </ts.SourceFile>

      <ts.SourceFile path="test2.ts">
        <ts.FunctionDeclaration export default name="test1" refkey={refkey("test3")} />
        <ts.FunctionDeclaration export name="test2" refkey={refkey("test4")} />
      </ts.SourceFile>

      <ts.SourceFile path="test3.ts">
        const v1 = <Reference refkey={refkey("test1")} />;
        const v1_1 = <Reference refkey={refkey("test2")}/>;
        const v2 = <Reference refkey={refkey("test3")} />;
        const v3 = <Reference refkey={refkey("test3")}/>;
        const v4 = <Reference refkey={refkey("test4")} />;
      </ts.SourceFile>
    </Output>
  );

  printOutput(res);
});

it("works with imports from different directories", () => {
  const res = render(
    <Output>
      <SourceDirectory path="src">
        <ts.SourceFile path="test1.ts">
          <ts.FunctionDeclaration export name="test" />
          const v = <Reference refkey={refkey("test2")} />
        </ts.SourceFile>
      </SourceDirectory>

      <ts.SourceFile path="test2.ts">
        const v = <Reference refkey={refkey("test")} />;
        <ts.FunctionDeclaration export name="test2" />
      </ts.SourceFile>
    </Output>
  );

  printOutput(res);
});



function printOutput(dir: OutputDirectory, level = 1) {
  console.log(`${"#".repeat(level)} Directory ${dir.path}`);

  for (const item of dir.contents) {
    if (item.kind === "directory") {
      printOutput(item, level + 1);
    } else {
      console.log(
        `\n${"#".repeat(level + 1)} ${item.path} (${item.filetype})\n`
      );
      console.log(item.contents.trimStart());
    }
  }
}
