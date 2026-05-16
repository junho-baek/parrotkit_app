const Module = require("node:module");
const { resolve } = require("node:path");

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveTsconfigAlias(
  request,
  parent,
  isMain,
  options,
) {
  if (request.startsWith("@/")) {
    return originalResolveFilename(
      resolve(process.cwd(), "src", request.slice(2)),
      parent,
      isMain,
      options,
    );
  }

  return originalResolveFilename(request, parent, isMain, options);
};

