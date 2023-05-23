// TODO(Babel 8): Remove this file
/* eslint sort-keys: "error" */
// These mappings represent the transform plugins that have been
// shipped by browsers, and are enabled by the `shippedProposals` option.

const proposalPlugins = new Set<string>();

// proposal syntax plugins enabled by the `shippedProposals` option.
// Unlike proposalPlugins above, they are independent of compiler targets.
const proposalSyntaxPlugins = [
  "syntax-import-assertions",
  "syntax-import-attributes",
] as const;

// use intermediary object to enforce alphabetical key order
const pluginSyntaxObject = {
  "transform-async-generator-functions": "syntax-async-generators",
  "transform-class-properties": "syntax-class-properties",
  "transform-class-static-block": "syntax-class-static-block",
  "transform-json-strings": "syntax-json-strings",
  "transform-nullish-coalescing-operator": "syntax-nullish-coalescing-operator",
  "transform-numeric-separator": "syntax-numeric-separator",
  "transform-object-rest-spread": "syntax-object-rest-spread",
  "transform-optional-catch-binding": "syntax-optional-catch-binding",
  "transform-optional-chaining": "syntax-optional-chaining",
  // note: we don't have syntax-private-methods
  "transform-private-methods": "syntax-class-properties",
  "transform-private-property-in-object": "syntax-private-property-in-object",
  "transform-unicode-property-regex": null as null,
} as const;

const pluginSyntaxEntries = Object.keys(pluginSyntaxObject).map<
  [string, string | null]
>(function (key) {
  return [
    key,
    // @ts-expect-error key has been guarded
    pluginSyntaxObject[key],
  ];
});

const pluginSyntaxMap = new Map(pluginSyntaxEntries);

export { proposalPlugins, proposalSyntaxPlugins, pluginSyntaxMap };
