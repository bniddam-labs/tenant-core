import * as tenant_core_shared_star from '@bniddam-labs/tenant-core-shared';

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);

// src/types/index.ts
var types_exports = {};

// src/types/tenant.types.ts
var tenant_types_exports = {};
__reExport(tenant_types_exports, tenant_core_shared_star);

// src/types/index.ts
__reExport(types_exports, tenant_types_exports);
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map