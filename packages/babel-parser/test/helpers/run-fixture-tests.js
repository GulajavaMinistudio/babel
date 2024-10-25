import { multiple as getFixtures } from "@babel/helper-fixtures";
import _checkDuplicateNodes from "@babel/helper-check-duplicate-nodes";
import { readFileSync, unlinkSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import Difference from "./difference.js";
import FixtureError from "./fixture-error.js";
import toFuzzedOptions from "./to-fuzzed-options.js";
import { serialize, deserialize } from "./serialization.js";
import toContextualSyntaxError from "./to-contextual-syntax-error.js";
import { traverseFast } from "@babel/types";
import { IS_BABEL_8 } from "$repo-utils";

const { CI, OVERWRITE } = process.env;
const { stringify, parse: JSONParse } = JSON;
const checkDuplicateNodes =
  _checkDuplicateNodes.default || _checkDuplicateNodes;

const writeFileWithNewline = (path, string) =>
  writeFileSync(path, `${string}\n`, "utf-8");

/**
 * run parser on given tests
 *
 * @param {string} fixturesPath A base search path for finding fixtures.
 * @param {*} parseFunction A parser with the same interface of
 * `@babel/parser#parse`
 * @param {boolean} [onlyCompareErrors=false] Whether we should only compare the
 * "errors" of generated ast against the expected AST. Used for tests where an
 * ESTree AST is generated but we want to make sure `@babel/parser` still throws
 * expected recoverable recoverable errors on given code locations.
 * @returns {void}
 */
export default function runFixtureTests(
  fixturesPath,
  parseFunction,
  onlyCompareErrors = false,
) {
  const fixtures = getFixtures(fixturesPath);

  for (const [name, testSuites] of Object.entries(fixtures)) {
    for (const { title, tests } of testSuites) {
      for (const test of tests) {
        runAutogeneratedParseTests(
          parseFunction,
          `${name}/${title}`,
          test,
          onlyCompareErrors,
        );
      }
    }
  }
}

function runAutogeneratedParseTests(
  parse,
  prefix,
  task,
  onlyCompareErrors = false,
) {
  const { expect, options } = task;
  const testFn = task.disabled ? it.skip : it;

  const expected = deserialize(expect.loc, options, expect.code);
  const title = `${prefix}/${task.title}`;
  const toStartPosition = ({
    startIndex = 0,
    startLine = 1,
    startColumn = 0,
  }) =>
    `(${startIndex === 0 ? "" : `${startIndex}, `}${startLine}, ${startColumn})`;

  toFuzzedOptions(options)
    .map(([adjust, options], index) => ({
      ...task,
      title: `${title} start = ${toStartPosition(options)}`,
      adjust,
      options,
      expected,
      filename: task.actual.loc,
      source: task.actual.code,
      original: index === 0,
    }))
    .forEach(test =>
      testFn(test.title, () => runParseTest(parse, test, onlyCompareErrors)),
    );
}

const toJustErrors = result => ({
  threw: result.threw,
  ast: result.ast && { errors: result.ast.errors },
});

function runParseTest(parse, test, onlyCompareErrors) {
  const { adjust, expected, source, filename, options } = test;

  if (!OVERWRITE && expected.threw && expected.ast) {
    throw Error(
      "File expected.json exists although options specify throws. Remove expected.json.",
    );
  }

  const actual = parseWithRecovery(parse, source, filename, options);
  const difference = new Difference(
    adjust,
    onlyCompareErrors ? toJustErrors(expected) : expected,
    onlyCompareErrors ? toJustErrors(actual) : actual,
  );

  // No differences means we passed and there's nothing left to do.
  if (difference === Difference.None) return;

  // We only write the output of the original test, not all it's auto-generated
  // variations.
  if (!test.original) return;

  const testLocation = test.taskDir;

  // FIXME: We're just maintaining the legacy behavior of storing *just* the
  // error `message` here, which differs from the error's `toString()` that we
  // store for each error in the `errors` array. In both cases, we should
  // serialize the full error to be able to property test locations,
  // reasonCodes, etc.
  const throws = actual.threw ? actual.threw.message : undefined;
  const optionsLocation = join(testLocation, "options.json");

  // We want to throw away the contents of `throws` here.
  const { throws: expectedThrows, ...oldOptions } = readJSON(optionsLocation);
  const newOptions = { ...oldOptions, ...(throws && { throws }) };

  const normalLocation = join(testLocation, "output.json");
  const extendedLocation = join(testLocation, "output.extended.json");

  // If we're not overwriting the current values with whatever we get this time
  // around, then we have a legitimate error that we need to report.

  const shouldThrow =
    expectedThrows !== undefined ||
    existsSync(normalLocation) ||
    existsSync(extendedLocation);

  if (CI || (!OVERWRITE && shouldThrow)) {
    const err = new Error();
    err.message = `Test Failed: ${testLocation}\nFixtureError.fromDifference: ${
      FixtureError.fromDifference(difference, actual).message
    }`;
    throw err;
  }

  // Store (or overwrite) the options file if there's anything to record,
  // otherwise remove it.
  if (Object.keys(newOptions).length <= 0) {
    rmf(optionsLocation);
  } else if (throws !== expectedThrows) {
    // The idea here is that we shouldn't need to change anything if this doesn't
    // throw, and stringify will produce different output than what prettier
    // wants.
    writeFileWithNewline(optionsLocation, stringify(newOptions, null, 2));
  }

  // When only comparing errors, we don't want to overwrite the AST JSON because
  // it belongs to a different test.
  if (onlyCompareErrors) return;

  const [extended, serialized] = actual.ast ? serialize(actual.ast) : [];
  const outputLocation =
    serialized && (extended ? extendedLocation : normalLocation);

  if (outputLocation) {
    writeFileWithNewline(outputLocation, serialized);
  }

  // Remove any previous output files that are no longer valid, either because
  // extension changed, or because we aren't writing it out at all anymore.
  for (const location of [normalLocation, extendedLocation]) {
    if (location !== outputLocation) {
      rmf(location);
    }
  }
}

function readJSON(filename) {
  try {
    return JSONParse(readFileSync(filename, "utf-8"));
  } catch {
    return {};
  }
}

function rmf(path) {
  try {
    unlinkSync(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function parseWithRecovery(parse, source, filename, options) {
  try {
    const ast = parse(source, { errorRecovery: true, ...options });
    checkDuplicateNodes(ast);

    // Normalize the AST
    //
    // TODO: We should consider doing something more involved here as
    // we may miss bugs where we put unexpected falsy objects in these
    // properties.
    if (ast.comments && !ast.comments.length) delete ast.comments;
    if (ast.errors && !ast.errors.length) delete ast.errors;
    else {
      ast.errors = ast.errors.map(error =>
        toContextualSyntaxError(error, source, filename, options),
      );
    }

    if (!IS_BABEL_8()) {
      traverseFast(ast, node => {
        if (node.shorthand) {
          delete node.extra.shorthand;
          if (Object.keys(node.extra).length === 0) {
            delete node.extra;
          }
        }
      });
    }

    return { threw: false, ast };
  } catch (error) {
    return {
      threw: toContextualSyntaxError(error, source, filename, options),
      ast: false,
    };
  }
}
