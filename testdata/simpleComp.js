(() => {
  // node_modules/.pnpm/solid-js@1.9.13/node_modules/solid-js/dist/server.js
  var ERROR = /* @__PURE__ */ Symbol("error");
  function castError(err) {
    if (err instanceof Error) return err;
    return new Error(typeof err === "string" ? err : "Unknown error", {
      cause: err
    });
  }
  function handleError(err, owner = Owner) {
    const fns = owner && owner.context && owner.context[ERROR];
    const error = castError(err);
    if (!fns) throw error;
    try {
      for (const f of fns) f(error);
    } catch (e) {
      handleError(e, owner && owner.owner || null);
    }
  }
  var UNOWNED = {
    context: null,
    owner: null,
    owned: null,
    cleanups: null
  };
  var Owner = null;
  function createOwner() {
    const o = {
      owner: Owner,
      context: Owner ? Owner.context : null,
      owned: null,
      cleanups: null
    };
    if (Owner) {
      if (!Owner.owned) Owner.owned = [o];
      else Owner.owned.push(o);
    }
    return o;
  }
  function createRoot(fn, detachedOwner) {
    const owner = Owner, current = detachedOwner === void 0 ? owner : detachedOwner, root = fn.length === 0 ? UNOWNED : {
      context: current ? current.context : null,
      owner: current,
      owned: null,
      cleanups: null
    };
    Owner = root;
    let result;
    try {
      result = fn(fn.length === 0 ? () => {
      } : () => cleanNode(root));
    } catch (err) {
      handleError(err);
    } finally {
      Owner = owner;
    }
    return result;
  }
  function createMemo(fn, value) {
    Owner = createOwner();
    let v;
    try {
      v = fn(value);
    } catch (err) {
      handleError(err);
    } finally {
      Owner = Owner.owner;
    }
    return () => v;
  }
  function cleanNode(node) {
    if (node.owned) {
      for (let i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (let i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
      node.cleanups = null;
    }
  }
  function createContext(defaultValue) {
    const id = /* @__PURE__ */ Symbol("context");
    return {
      id,
      Provider: createProvider(id),
      defaultValue
    };
  }
  function children(fn) {
    const memo = createMemo(() => resolveChildren(fn()));
    memo.toArray = () => {
      const c = memo();
      return Array.isArray(c) ? c : c != null ? [c] : [];
    };
    return memo;
  }
  function resolveChildren(children2) {
    if (typeof children2 === "function" && !children2.length) return resolveChildren(children2());
    if (Array.isArray(children2)) {
      const results = [];
      for (let i = 0; i < children2.length; i++) {
        const result = resolveChildren(children2[i]);
        if (Array.isArray(result)) {
          if (result.length < 32768) results.push.apply(results, result);
          else for (let j = 0; j < result.length; j++) results.push(result[j]);
        } else {
          results.push(result);
        }
      }
      return results;
    }
    return children2;
  }
  function createProvider(id) {
    return function provider(props) {
      return createMemo(() => {
        Owner.context = {
          ...Owner.context,
          [id]: props.value
        };
        return children(() => props.children);
      });
    };
  }
  var sharedConfig = {
    context: void 0,
    getContextId() {
      if (!this.context) throw new Error(`getContextId cannot be used under non-hydrating context`);
      return getContextId(this.context.count);
    },
    getNextContextId() {
      if (!this.context) throw new Error(`getNextContextId cannot be used under non-hydrating context`);
      return getContextId(this.context.count++);
    }
  };
  function getContextId(count) {
    const num = String(count), len = num.length - 1;
    return sharedConfig.context.id + (len ? String.fromCharCode(96 + len) : "") + num;
  }
  function setHydrateContext(context) {
    sharedConfig.context = context;
  }
  function nextHydrateContext() {
    return sharedConfig.context ? {
      ...sharedConfig.context,
      id: sharedConfig.getNextContextId(),
      count: 0
    } : void 0;
  }
  function createComponent(Comp, props) {
    if (sharedConfig.context && !sharedConfig.context.noHydrate) {
      const c = sharedConfig.context;
      setHydrateContext(nextHydrateContext());
      const r = Comp(props || {});
      setHydrateContext(c);
      return r;
    }
    return Comp(props || {});
  }
  function mergeProps(...sources) {
    const target = {};
    for (let i = 0; i < sources.length; i++) {
      let source = sources[i];
      if (typeof source === "function") source = source();
      if (source) {
        const descriptors = Object.getOwnPropertyDescriptors(source);
        for (const key in descriptors) {
          if (key in target) continue;
          Object.defineProperty(target, key, {
            enumerable: true,
            get() {
              for (let i2 = sources.length - 1; i2 >= 0; i2--) {
                let v, s = sources[i2];
                if (typeof s === "function") s = s();
                v = (s || {})[key];
                if (v !== void 0) return v;
              }
            }
          });
        }
      }
    }
    return target;
  }
  var SuspenseContext = createContext();

  // node_modules/.pnpm/seroval@1.5.4/node_modules/seroval/dist/esm/development/index.mjs
  var Feature = /* @__PURE__ */ ((Feature2) => {
    Feature2[Feature2["AggregateError"] = 1] = "AggregateError";
    Feature2[Feature2["ArrowFunction"] = 2] = "ArrowFunction";
    Feature2[Feature2["ErrorPrototypeStack"] = 4] = "ErrorPrototypeStack";
    Feature2[Feature2["ObjectAssign"] = 8] = "ObjectAssign";
    Feature2[Feature2["BigIntTypedArray"] = 16] = "BigIntTypedArray";
    Feature2[Feature2["RegExp"] = 32] = "RegExp";
    return Feature2;
  })(Feature || {});
  var ALL_ENABLED = 1 | 2 | 4 | 8 | 16 | 32;
  var SYM_ASYNC_ITERATOR = Symbol.asyncIterator;
  var SYM_HAS_INSTANCE = Symbol.hasInstance;
  var SYM_IS_CONCAT_SPREADABLE = Symbol.isConcatSpreadable;
  var SYM_ITERATOR = Symbol.iterator;
  var SYM_MATCH = Symbol.match;
  var SYM_MATCH_ALL = Symbol.matchAll;
  var SYM_REPLACE = Symbol.replace;
  var SYM_SEARCH = Symbol.search;
  var SYM_SPECIES = Symbol.species;
  var SYM_SPLIT = Symbol.split;
  var SYM_TO_PRIMITIVE = Symbol.toPrimitive;
  var SYM_TO_STRING_TAG = Symbol.toStringTag;
  var SYM_UNSCOPABLES = Symbol.unscopables;
  var SYMBOL_STRING = {
    [
      0
      /* AsyncIterator */
    ]: "Symbol.asyncIterator",
    [
      1
      /* HasInstance */
    ]: "Symbol.hasInstance",
    [
      2
      /* IsConcatSpreadable */
    ]: "Symbol.isConcatSpreadable",
    [
      3
      /* Iterator */
    ]: "Symbol.iterator",
    [
      4
      /* Match */
    ]: "Symbol.match",
    [
      5
      /* MatchAll */
    ]: "Symbol.matchAll",
    [
      6
      /* Replace */
    ]: "Symbol.replace",
    [
      7
      /* Search */
    ]: "Symbol.search",
    [
      8
      /* Species */
    ]: "Symbol.species",
    [
      9
      /* Split */
    ]: "Symbol.split",
    [
      10
      /* ToPrimitive */
    ]: "Symbol.toPrimitive",
    [
      11
      /* ToStringTag */
    ]: "Symbol.toStringTag",
    [
      12
      /* Unscopables */
    ]: "Symbol.unscopables"
  };
  var INV_SYMBOL_REF = {
    [SYM_ASYNC_ITERATOR]: 0,
    [SYM_HAS_INSTANCE]: 1,
    [SYM_IS_CONCAT_SPREADABLE]: 2,
    [SYM_ITERATOR]: 3,
    [SYM_MATCH]: 4,
    [SYM_MATCH_ALL]: 5,
    [SYM_REPLACE]: 6,
    [SYM_SEARCH]: 7,
    [SYM_SPECIES]: 8,
    [SYM_SPLIT]: 9,
    [SYM_TO_PRIMITIVE]: 10,
    [SYM_TO_STRING_TAG]: 11,
    [SYM_UNSCOPABLES]: 12
    /* Unscopables */
  };
  var CONSTANT_STRING = {
    [
      2
      /* True */
    ]: "!0",
    [
      3
      /* False */
    ]: "!1",
    [
      1
      /* Undefined */
    ]: "void 0",
    [
      0
      /* Null */
    ]: "null",
    [
      4
      /* NegZero */
    ]: "-0",
    [
      5
      /* Inf */
    ]: "1/0",
    [
      6
      /* NegInf */
    ]: "-1/0",
    [
      7
      /* Nan */
    ]: "0/0"
  };
  var NIL = void 0;
  var CONSTANT_VAL = {
    [
      2
      /* True */
    ]: true,
    [
      3
      /* False */
    ]: false,
    [
      1
      /* Undefined */
    ]: NIL,
    [
      0
      /* Null */
    ]: null,
    [
      4
      /* NegZero */
    ]: -0,
    [
      5
      /* Inf */
    ]: Number.POSITIVE_INFINITY,
    [
      6
      /* NegInf */
    ]: Number.NEGATIVE_INFINITY,
    [
      7
      /* Nan */
    ]: Number.NaN
  };
  var ERROR_CONSTRUCTOR_STRING = {
    [
      0
      /* Error */
    ]: "Error",
    [
      1
      /* EvalError */
    ]: "EvalError",
    [
      2
      /* RangeError */
    ]: "RangeError",
    [
      3
      /* ReferenceError */
    ]: "ReferenceError",
    [
      4
      /* SyntaxError */
    ]: "SyntaxError",
    [
      5
      /* TypeError */
    ]: "TypeError",
    [
      6
      /* URIError */
    ]: "URIError"
  };
  function createSerovalNode(t, i, s, c, m, p, e, a, f, b, o, l) {
    return {
      t,
      i,
      s,
      c,
      m,
      p,
      e,
      a,
      f,
      b,
      o,
      l
    };
  }
  function createConstantNode(value) {
    return createSerovalNode(
      2,
      NIL,
      value,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  var TRUE_NODE = /* @__PURE__ */ createConstantNode(
    2
    /* True */
  );
  var FALSE_NODE = /* @__PURE__ */ createConstantNode(
    3
    /* False */
  );
  var UNDEFINED_NODE = /* @__PURE__ */ createConstantNode(
    1
    /* Undefined */
  );
  var NULL_NODE = /* @__PURE__ */ createConstantNode(
    0
    /* Null */
  );
  var NEG_ZERO_NODE = /* @__PURE__ */ createConstantNode(
    4
    /* NegZero */
  );
  var INFINITY_NODE = /* @__PURE__ */ createConstantNode(
    5
    /* Inf */
  );
  var NEG_INFINITY_NODE = /* @__PURE__ */ createConstantNode(
    6
    /* NegInf */
  );
  var NAN_NODE = /* @__PURE__ */ createConstantNode(
    7
    /* Nan */
  );
  function serializeChar(str) {
    switch (str) {
      case '"':
        return '\\"';
      case "\\":
        return "\\\\";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\b":
        return "\\b";
      case "	":
        return "\\t";
      case "\f":
        return "\\f";
      case "<":
        return "\\x3C";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        return NIL;
    }
  }
  function serializeString(str) {
    let result = "";
    let lastPos = 0;
    let replacement;
    for (let i = 0, len = str.length; i < len; i++) {
      replacement = serializeChar(str[i]);
      if (replacement) {
        result += str.slice(lastPos, i) + replacement;
        lastPos = i + 1;
      }
    }
    if (lastPos === 0) {
      result = str;
    } else {
      result += str.slice(lastPos);
    }
    return result;
  }
  var REFERENCES_KEY = "__SEROVAL_REFS__";
  var GLOBAL_CONTEXT_REFERENCES = "$R";
  var GLOBAL_CONTEXT_R = `self.${GLOBAL_CONTEXT_REFERENCES}`;
  function getCrossReferenceHeader(id) {
    if (id == null) {
      return `${GLOBAL_CONTEXT_R}=${GLOBAL_CONTEXT_R}||[]`;
    }
    return `(${GLOBAL_CONTEXT_R}=${GLOBAL_CONTEXT_R}||{})["${serializeString(
      id
    )}"]=[]`;
  }
  var REFERENCE = /* @__PURE__ */ new Map();
  var INV_REFERENCE = /* @__PURE__ */ new Map();
  function hasReferenceID(value) {
    return REFERENCE.has(value);
  }
  function getReferenceID(value) {
    if (hasReferenceID(value)) {
      return REFERENCE.get(value);
    }
    throw new SerovalMissingReferenceError(value);
  }
  if (typeof globalThis !== "undefined") {
    Object.defineProperty(globalThis, REFERENCES_KEY, {
      value: INV_REFERENCE,
      configurable: true,
      writable: false,
      enumerable: false
    });
  } else if (typeof window !== "undefined") {
    Object.defineProperty(window, REFERENCES_KEY, {
      value: INV_REFERENCE,
      configurable: true,
      writable: false,
      enumerable: false
    });
  } else if (typeof self !== "undefined") {
    Object.defineProperty(self, REFERENCES_KEY, {
      value: INV_REFERENCE,
      configurable: true,
      writable: false,
      enumerable: false
    });
  } else if (typeof global !== "undefined") {
    Object.defineProperty(global, REFERENCES_KEY, {
      value: INV_REFERENCE,
      configurable: true,
      writable: false,
      enumerable: false
    });
  }
  function getErrorConstructor(error) {
    if (error instanceof EvalError) {
      return 1;
    }
    if (error instanceof RangeError) {
      return 2;
    }
    if (error instanceof ReferenceError) {
      return 3;
    }
    if (error instanceof SyntaxError) {
      return 4;
    }
    if (error instanceof TypeError) {
      return 5;
    }
    if (error instanceof URIError) {
      return 6;
    }
    return 0;
  }
  function getInitialErrorOptions(error) {
    const construct = ERROR_CONSTRUCTOR_STRING[getErrorConstructor(error)];
    if (error.name !== construct) {
      return { name: error.name };
    }
    if (error.constructor.name !== construct) {
      return { name: error.constructor.name };
    }
    return {};
  }
  function getErrorOptions(error, features) {
    let options = getInitialErrorOptions(error);
    const names = Object.getOwnPropertyNames(error);
    for (let i = 0, len = names.length, name; i < len; i++) {
      name = names[i];
      if (name !== "name" && name !== "message") {
        if (name === "stack") {
          if (features & 4) {
            options = options || {};
            options[name] = error[name];
          }
        } else {
          options = options || {};
          options[name] = error[name];
        }
      }
    }
    return options;
  }
  function getObjectFlag(obj) {
    if (Object.isFrozen(obj)) {
      return 3;
    }
    if (Object.isSealed(obj)) {
      return 2;
    }
    if (Object.isExtensible(obj)) {
      return 0;
    }
    return 1;
  }
  function createNumberNode(value) {
    switch (value) {
      case Number.POSITIVE_INFINITY:
        return INFINITY_NODE;
      case Number.NEGATIVE_INFINITY:
        return NEG_INFINITY_NODE;
    }
    if (value !== value) {
      return NAN_NODE;
    }
    if (Object.is(value, -0)) {
      return NEG_ZERO_NODE;
    }
    return createSerovalNode(
      0,
      NIL,
      value,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createStringNode(value) {
    return createSerovalNode(
      1,
      NIL,
      serializeString(value),
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createBigIntNode(current) {
    return createSerovalNode(
      3,
      NIL,
      "" + current,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createIndexedValueNode(id) {
    return createSerovalNode(
      4,
      id,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createDateNode(id, current) {
    const timestamp = current.valueOf();
    return createSerovalNode(
      5,
      id,
      timestamp !== timestamp ? "" : current.toISOString(),
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createRegExpNode(id, current) {
    return createSerovalNode(
      6,
      id,
      NIL,
      serializeString(current.source),
      current.flags,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createWKSymbolNode(id, current) {
    return createSerovalNode(
      17,
      id,
      INV_SYMBOL_REF[current],
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createReferenceNode(id, ref) {
    return createSerovalNode(
      18,
      id,
      serializeString(getReferenceID(ref)),
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createPluginNode(id, tag, value) {
    return createSerovalNode(
      25,
      id,
      value,
      serializeString(tag),
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createArrayNode(id, current, parsedItems) {
    return createSerovalNode(
      9,
      id,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      parsedItems,
      NIL,
      NIL,
      getObjectFlag(current),
      NIL
    );
  }
  function createBoxedNode(id, boxed) {
    return createSerovalNode(
      21,
      id,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      boxed,
      NIL,
      NIL,
      NIL
    );
  }
  function createTypedArrayNode(id, current, buffer) {
    return createSerovalNode(
      15,
      id,
      NIL,
      current.constructor.name,
      NIL,
      NIL,
      NIL,
      NIL,
      buffer,
      current.byteOffset,
      NIL,
      current.length
    );
  }
  function createBigIntTypedArrayNode(id, current, buffer) {
    return createSerovalNode(
      16,
      id,
      NIL,
      current.constructor.name,
      NIL,
      NIL,
      NIL,
      NIL,
      buffer,
      current.byteOffset,
      NIL,
      current.byteLength
    );
  }
  function createDataViewNode(id, current, buffer) {
    return createSerovalNode(
      20,
      id,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      buffer,
      current.byteOffset,
      NIL,
      current.byteLength
    );
  }
  function createErrorNode(id, current, options) {
    return createSerovalNode(
      13,
      id,
      getErrorConstructor(current),
      NIL,
      serializeString(current.message),
      options,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createAggregateErrorNode(id, current, options) {
    return createSerovalNode(
      14,
      id,
      getErrorConstructor(current),
      NIL,
      serializeString(current.message),
      options,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createSetNode(id, items) {
    return createSerovalNode(
      7,
      id,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      items,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createIteratorFactoryInstanceNode(factory, items) {
    return createSerovalNode(
      28,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      [factory, items],
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createAsyncIteratorFactoryInstanceNode(factory, items) {
    return createSerovalNode(
      30,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      [factory, items],
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createStreamConstructorNode(id, factory, sequence) {
    return createSerovalNode(
      31,
      id,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      sequence,
      factory,
      NIL,
      NIL,
      NIL
    );
  }
  function createStreamNextNode(id, parsed) {
    return createSerovalNode(
      32,
      id,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      parsed,
      NIL,
      NIL,
      NIL
    );
  }
  function createStreamThrowNode(id, parsed) {
    return createSerovalNode(
      33,
      id,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      parsed,
      NIL,
      NIL,
      NIL
    );
  }
  function createStreamReturnNode(id, parsed) {
    return createSerovalNode(
      34,
      id,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      parsed,
      NIL,
      NIL,
      NIL
    );
  }
  function createSequenceNode(id, sequence, throwAt, doneAt) {
    return createSerovalNode(
      35,
      id,
      throwAt,
      NIL,
      NIL,
      NIL,
      NIL,
      sequence,
      NIL,
      NIL,
      NIL,
      doneAt
    );
  }
  var { toString: objectToString } = Object.prototype;
  function getErrorMessageDev(type, cause) {
    if (cause instanceof Error) {
      return `Seroval caught an error during the ${type} process.

${cause.name}
${cause.message}

- For more information, please check the "cause" property of this error.
- If you believe this is an error in Seroval, please submit an issue at https://github.com/lxsmnsyc/seroval/issues/new`;
    }
    return `Seroval caught an error during the ${type} process.

"${objectToString.call(cause)}"

For more information, please check the "cause" property of this error.`;
  }
  var getErrorMessage = (type, cause) => false ? getErrorMessageProd(type) : getErrorMessageDev(type, cause);
  var SerovalError = class extends Error {
    constructor(type, cause) {
      super(getErrorMessage(type, cause));
      this.cause = cause;
    }
  };
  var SerovalParserError = class extends SerovalError {
    constructor(cause) {
      super("parsing", cause);
    }
  };
  var SerovalUnsupportedTypeError = class extends Error {
    constructor(value) {
      super(
        false ? getSpecificErrorMessage(
          1
          /* UnsupportedType */
        ) : `The value ${objectToString.call(value)} of type "${typeof value}" cannot be parsed/serialized.
      
There are few workarounds for this problem:
- Transform the value in a way that it can be serialized.
- If the reference is present on multiple runtimes (isomorphic), you can use the Reference API to map the references.`
      );
      this.value = value;
    }
  };
  var SerovalUnsupportedNodeError = class extends Error {
    constructor(node) {
      super(
        false ? getSpecificErrorMessage(
          2
          /* UnsupportedNode */
        ) : 'Unsupported node type "' + node.t + '".'
      );
    }
  };
  var SerovalMissingPluginError = class extends Error {
    constructor(tag) {
      super(
        false ? getSpecificErrorMessage(
          3
          /* MissingPlugin */
        ) : 'Missing plugin for tag "' + tag + '".'
      );
    }
  };
  var SerovalMissingReferenceError = class extends Error {
    constructor(value) {
      super(
        false ? getSpecificErrorMessage(
          5
          /* MissingReference */
        ) : 'Missing reference for the value "' + objectToString.call(value) + '" of type "' + typeof value + '"'
      );
      this.value = value;
    }
  };
  var SerovalDepthLimitError = class extends Error {
    constructor(limit) {
      super(
        false ? getSpecificErrorMessage(
          9
          /* ConflictedNodeId */
        ) : "Depth limit of " + limit + " reached"
      );
    }
  };
  var OpaqueReference = class {
    constructor(value, replacement) {
      this.value = value;
      this.replacement = replacement;
    }
  };
  var PROMISE_CONSTRUCTOR = () => {
    const resolver = {
      p: 0,
      s: 0,
      f: 0
    };
    resolver.p = new Promise((resolve, reject) => {
      resolver.s = resolve;
      resolver.f = reject;
    });
    return resolver;
  };
  var PROMISE_SUCCESS = (resolver, data) => {
    resolver.s(data);
    resolver.p.s = 1;
    resolver.p.v = data;
  };
  var PROMISE_FAILURE = (resolver, data) => {
    resolver.f(data);
    resolver.p.s = 2;
    resolver.p.v = data;
  };
  var SERIALIZED_PROMISE_CONSTRUCTOR = /* @__PURE__ */ PROMISE_CONSTRUCTOR.toString();
  var SERIALIZED_PROMISE_SUCCESS = /* @__PURE__ */ PROMISE_SUCCESS.toString();
  var SERIALIZED_PROMISE_FAILURE = /* @__PURE__ */ PROMISE_FAILURE.toString();
  var STREAM_CONSTRUCTOR = () => {
    const buffer = [];
    const listeners = [];
    let alive = true;
    let success = false;
    let count = 0;
    const flush = (value, mode, x) => {
      for (x = 0; x < count; x++) {
        if (listeners[x]) {
          listeners[x][mode](value);
        }
      }
    };
    const up = (listener, x, z, current) => {
      for (x = 0, z = buffer.length; x < z; x++) {
        current = buffer[x];
        if (!alive && x === z - 1) {
          listener[success ? "return" : "throw"](current);
        } else {
          listener.next(current);
        }
      }
    };
    const on = (listener, temp) => {
      if (alive) {
        temp = count++;
        listeners[temp] = listener;
      }
      up(listener);
      return () => {
        if (alive) {
          listeners[temp] = listeners[count];
          listeners[count--] = void 0;
        }
      };
    };
    return {
      __SEROVAL_STREAM__: true,
      on: (listener) => on(listener),
      next: (value) => {
        if (alive) {
          buffer.push(value);
          flush(value, "next");
        }
      },
      throw: (value) => {
        if (alive) {
          buffer.push(value);
          flush(value, "throw");
          alive = false;
          success = false;
          listeners.length = 0;
        }
      },
      return: (value) => {
        if (alive) {
          buffer.push(value);
          flush(value, "return");
          alive = false;
          success = true;
          listeners.length = 0;
        }
      }
    };
  };
  var SERIALIZED_STREAM_CONSTRUCTOR = /* @__PURE__ */ STREAM_CONSTRUCTOR.toString();
  var ITERATOR_CONSTRUCTOR = (symbol) => (sequence) => () => {
    let index = 0;
    const instance = {
      [symbol]: () => instance,
      next: () => {
        if (index > sequence.d) {
          return {
            done: true,
            value: void 0
          };
        }
        const currentIndex = index++;
        const data = sequence.v[currentIndex];
        if (currentIndex === sequence.t) {
          throw data;
        }
        return {
          done: currentIndex === sequence.d,
          value: data
        };
      }
    };
    return instance;
  };
  var SERIALIZED_ITERATOR_CONSTRUCTOR = /* @__PURE__ */ ITERATOR_CONSTRUCTOR.toString();
  var ASYNC_ITERATOR_CONSTRUCTOR = (symbol, createPromise) => (stream) => () => {
    let count = 0;
    let doneAt = -1;
    let isThrow = false;
    const buffer = [];
    const pending = [];
    const finalize = (i = 0, len = pending.length) => {
      for (; i < len; i++) {
        pending[i].s({
          done: true,
          value: void 0
        });
      }
    };
    stream.on({
      next: (value) => {
        const temp = pending.shift();
        if (temp) {
          temp.s({ done: false, value });
        }
        buffer.push(value);
      },
      throw: (value) => {
        const temp = pending.shift();
        if (temp) {
          temp.f(value);
        }
        finalize();
        doneAt = buffer.length;
        isThrow = true;
        buffer.push(value);
      },
      return: (value) => {
        const temp = pending.shift();
        if (temp) {
          temp.s({ done: true, value });
        }
        finalize();
        doneAt = buffer.length;
        buffer.push(value);
      }
    });
    const instance = {
      [symbol]: () => instance,
      next: () => {
        if (doneAt === -1) {
          const index2 = count++;
          if (index2 >= buffer.length) {
            const temp = createPromise();
            pending.push(temp);
            return temp.p;
          }
          return {
            done: false,
            value: buffer[index2]
          };
        }
        if (count > doneAt) {
          return {
            done: true,
            value: void 0
          };
        }
        const index = count++;
        const value = buffer[index];
        if (index !== doneAt) {
          return {
            done: false,
            value
          };
        }
        if (isThrow) {
          throw value;
        }
        return {
          done: true,
          value
        };
      }
    };
    return instance;
  };
  var SERIALIZED_ASYNC_ITERATOR_CONSTRUCTOR = /* @__PURE__ */ ASYNC_ITERATOR_CONSTRUCTOR.toString();
  var ARRAY_BUFFER_CONSTRUCTOR = (b64) => {
    const decoded = atob(b64);
    const length = decoded.length;
    const arr = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      arr[i] = decoded.charCodeAt(i);
    }
    return arr.buffer;
  };
  var SERIALIZED_ARRAY_BUFFER_CONSTRUCTOR = /* @__PURE__ */ ARRAY_BUFFER_CONSTRUCTOR.toString();
  function isSequence(value) {
    return "__SEROVAL_SEQUENCE__" in value;
  }
  function createSequence(values, throwAt, doneAt) {
    return {
      __SEROVAL_SEQUENCE__: true,
      v: values,
      t: throwAt,
      d: doneAt
    };
  }
  function createSequenceFromIterable(source) {
    const values = [];
    let throwsAt = -1;
    let doneAt = -1;
    const iterator = source[SYM_ITERATOR]();
    while (true) {
      try {
        const value = iterator.next();
        values.push(value.value);
        if (value.done) {
          doneAt = values.length - 1;
          break;
        }
      } catch (error) {
        throwsAt = values.length;
        values.push(error);
      }
    }
    return createSequence(values, throwsAt, doneAt);
  }
  var createIterator = ITERATOR_CONSTRUCTOR(SYM_ITERATOR);
  var ITERATOR = {};
  var ASYNC_ITERATOR = {};
  var SPECIAL_REFS = {
    [
      0
      /* MapSentinel */
    ]: {},
    [
      1
      /* PromiseConstructor */
    ]: {},
    [
      2
      /* PromiseSuccess */
    ]: {},
    [
      3
      /* PromiseFailure */
    ]: {},
    [
      4
      /* StreamConstructor */
    ]: {},
    [
      5
      /* ArrayBufferConstructor */
    ]: {}
  };
  var SPECIAL_REF_STRING = {
    [
      0
      /* MapSentinel */
    ]: "[]",
    [
      1
      /* PromiseConstructor */
    ]: SERIALIZED_PROMISE_CONSTRUCTOR,
    [
      2
      /* PromiseSuccess */
    ]: SERIALIZED_PROMISE_SUCCESS,
    [
      3
      /* PromiseFailure */
    ]: SERIALIZED_PROMISE_FAILURE,
    [
      4
      /* StreamConstructor */
    ]: SERIALIZED_STREAM_CONSTRUCTOR,
    [
      5
      /* ArrayBufferConstructor */
    ]: SERIALIZED_ARRAY_BUFFER_CONSTRUCTOR
  };
  function isStream(value) {
    return "__SEROVAL_STREAM__" in value;
  }
  function createStream() {
    return STREAM_CONSTRUCTOR();
  }
  function createStreamFromAsyncIterable(iterable) {
    const stream = createStream();
    const iterator = iterable[SYM_ASYNC_ITERATOR]();
    async function push() {
      try {
        const value = await iterator.next();
        if (value.done) {
          stream.return(value.value);
        } else {
          stream.next(value.value);
          await push();
        }
      } catch (error) {
        stream.throw(error);
      }
    }
    push().catch(() => {
    });
    return stream;
  }
  var createAsyncIterable = ASYNC_ITERATOR_CONSTRUCTOR(
    SYM_ASYNC_ITERATOR,
    PROMISE_CONSTRUCTOR
  );
  function createBaseParserContext(mode, options) {
    return {
      plugins: options.plugins,
      mode,
      marked: /* @__PURE__ */ new Set(),
      features: ALL_ENABLED ^ (options.disabledFeatures || 0),
      refs: options.refs || /* @__PURE__ */ new Map(),
      depthLimit: options.depthLimit || 1e3
    };
  }
  function markParserRef(ctx, id) {
    ctx.marked.add(id);
  }
  function createIndexForValue(ctx, current) {
    const id = ctx.refs.size;
    ctx.refs.set(current, id);
    return id;
  }
  function getNodeForIndexedValue(ctx, current) {
    const registeredId = ctx.refs.get(current);
    if (registeredId != null) {
      markParserRef(ctx, registeredId);
      return {
        type: 1,
        value: createIndexedValueNode(registeredId)
      };
    }
    return {
      type: 0,
      value: createIndexForValue(ctx, current)
    };
  }
  function getReferenceNode(ctx, current) {
    const indexed = getNodeForIndexedValue(ctx, current);
    if (indexed.type === 1) {
      return indexed;
    }
    if (hasReferenceID(current)) {
      return {
        type: 2,
        value: createReferenceNode(indexed.value, current)
      };
    }
    return indexed;
  }
  function parseWellKnownSymbol(ctx, current) {
    const ref = getReferenceNode(ctx, current);
    if (ref.type !== 0) {
      return ref.value;
    }
    if (current in INV_SYMBOL_REF) {
      return createWKSymbolNode(ref.value, current);
    }
    throw new SerovalUnsupportedTypeError(current);
  }
  function parseSpecialReference(ctx, ref) {
    const result = getNodeForIndexedValue(ctx, SPECIAL_REFS[ref]);
    if (result.type === 1) {
      return result.value;
    }
    return createSerovalNode(
      26,
      result.value,
      ref,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function parseIteratorFactory(ctx) {
    const result = getNodeForIndexedValue(ctx, ITERATOR);
    if (result.type === 1) {
      return result.value;
    }
    return createSerovalNode(
      27,
      result.value,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      parseWellKnownSymbol(ctx, SYM_ITERATOR),
      NIL,
      NIL,
      NIL
    );
  }
  function parseAsyncIteratorFactory(ctx) {
    const result = getNodeForIndexedValue(ctx, ASYNC_ITERATOR);
    if (result.type === 1) {
      return result.value;
    }
    return createSerovalNode(
      29,
      result.value,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      [
        parseSpecialReference(
          ctx,
          1
          /* PromiseConstructor */
        ),
        parseWellKnownSymbol(ctx, SYM_ASYNC_ITERATOR)
      ],
      NIL,
      NIL,
      NIL,
      NIL
    );
  }
  function createObjectNode(id, current, empty, record) {
    return createSerovalNode(
      empty ? 11 : 10,
      id,
      NIL,
      NIL,
      NIL,
      record,
      NIL,
      NIL,
      NIL,
      NIL,
      getObjectFlag(current),
      NIL
    );
  }
  function createMapNode(ctx, id, k, v) {
    return createSerovalNode(
      8,
      id,
      NIL,
      NIL,
      NIL,
      NIL,
      { k, v },
      NIL,
      parseSpecialReference(
        ctx,
        0
        /* MapSentinel */
      ),
      NIL,
      NIL,
      NIL
    );
  }
  function createPromiseConstructorNode(ctx, id, resolver) {
    return createSerovalNode(
      22,
      id,
      resolver,
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      parseSpecialReference(
        ctx,
        1
        /* PromiseConstructor */
      ),
      NIL,
      NIL,
      NIL
    );
  }
  function createArrayBufferNode(ctx, id, current) {
    const bytes = new Uint8Array(current);
    let result = "";
    for (let i = 0, len = bytes.length; i < len; i++) {
      result += String.fromCharCode(bytes[i]);
    }
    return createSerovalNode(
      19,
      id,
      serializeString(btoa(result)),
      NIL,
      NIL,
      NIL,
      NIL,
      NIL,
      parseSpecialReference(
        ctx,
        5
        /* ArrayBufferConstructor */
      ),
      NIL,
      NIL,
      NIL
    );
  }
  function createPlugin(plugin) {
    return plugin;
  }
  function dedupePlugins(deduped, plugins) {
    for (let i = 0, len = plugins.length; i < len; i++) {
      const current = plugins[i];
      if (!deduped.has(current)) {
        deduped.add(current);
        if (current.extends) {
          dedupePlugins(deduped, current.extends);
        }
      }
    }
  }
  function resolvePlugins(plugins) {
    if (plugins) {
      const deduped = /* @__PURE__ */ new Set();
      dedupePlugins(deduped, plugins);
      return [...deduped];
    }
    return void 0;
  }
  var RETURN = () => T;
  var SERIALIZED_RETURN = /* @__PURE__ */ RETURN.toString();
  var IS_MODERN = /* @__PURE__ */ /=>/.test(SERIALIZED_RETURN);
  function createFunction(parameters, body) {
    if (IS_MODERN) {
      const joined = parameters.length === 1 ? parameters[0] : "(" + parameters.join(",") + ")";
      return joined + "=>" + (body.startsWith("{") ? "(" + body + ")" : body);
    }
    return "function(" + parameters.join(",") + "){return " + body + "}";
  }
  function createEffectfulFunction(parameters, body) {
    if (IS_MODERN) {
      const joined = parameters.length === 1 ? parameters[0] : "(" + parameters.join(",") + ")";
      return joined + "=>{" + body + "}";
    }
    return "function(" + parameters.join(",") + "){" + body + "}";
  }
  var REF_START_CHARS = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
  var REF_START_CHARS_LEN = REF_START_CHARS.length;
  var REF_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
  var REF_CHARS_LEN = REF_CHARS.length;
  function getIdentifier(index) {
    let mod = index % REF_START_CHARS_LEN;
    let ref = REF_START_CHARS[mod];
    index = (index - mod) / REF_START_CHARS_LEN;
    while (index > 0) {
      mod = index % REF_CHARS_LEN;
      ref += REF_CHARS[mod];
      index = (index - mod) / REF_CHARS_LEN;
    }
    return ref;
  }
  var IDENTIFIER_CHECK = /^[$A-Z_][0-9A-Z_$]*$/i;
  function isValidIdentifier(name) {
    const char = name[0];
    return (char === "$" || char === "_" || char >= "A" && char <= "Z" || char >= "a" && char <= "z") && IDENTIFIER_CHECK.test(name);
  }
  function getAssignmentExpression(assignment) {
    switch (assignment.t) {
      case 0:
        return assignment.s + "=" + assignment.v;
      case 2:
        return assignment.s + ".set(" + assignment.k + "," + assignment.v + ")";
      case 1:
        return assignment.s + ".add(" + assignment.v + ")";
      case 3:
        return assignment.s + ".delete(" + assignment.k + ")";
    }
  }
  function mergeAssignments(assignments) {
    const newAssignments = [];
    let current = assignments[0];
    for (let i = 1, len = assignments.length, item, prev = current; i < len; i++) {
      item = assignments[i];
      if (item.t === 0 && item.v === prev.v) {
        current = {
          t: 0,
          s: item.s,
          k: NIL,
          v: getAssignmentExpression(current)
        };
      } else if (item.t === 2 && item.s === prev.s) {
        current = {
          t: 2,
          s: getAssignmentExpression(current),
          k: item.k,
          v: item.v
        };
      } else if (item.t === 1 && item.s === prev.s) {
        current = {
          t: 1,
          s: getAssignmentExpression(current),
          k: NIL,
          v: item.v
        };
      } else if (item.t === 3 && item.s === prev.s) {
        current = {
          t: 3,
          s: getAssignmentExpression(current),
          k: item.k,
          v: NIL
        };
      } else {
        newAssignments.push(current);
        current = item;
      }
      prev = item;
    }
    newAssignments.push(current);
    return newAssignments;
  }
  function resolveAssignments(assignments) {
    if (assignments.length) {
      let result = "";
      const merged = mergeAssignments(assignments);
      for (let i = 0, len = merged.length; i < len; i++) {
        result += getAssignmentExpression(merged[i]) + ",";
      }
      return result;
    }
    return NIL;
  }
  var NULL_CONSTRUCTOR = "Object.create(null)";
  var SET_CONSTRUCTOR = "new Set";
  var MAP_CONSTRUCTOR = "new Map";
  var PROMISE_RESOLVE = "Promise.resolve";
  var PROMISE_REJECT = "Promise.reject";
  var OBJECT_FLAG_CONSTRUCTOR = {
    [
      3
      /* Frozen */
    ]: "Object.freeze",
    [
      2
      /* Sealed */
    ]: "Object.seal",
    [
      1
      /* NonExtensible */
    ]: "Object.preventExtensions",
    [
      0
      /* None */
    ]: NIL
  };
  function createBaseSerializerContext(mode, options) {
    return {
      mode,
      plugins: options.plugins,
      features: options.features,
      marked: new Set(options.markedRefs),
      stack: [],
      flags: [],
      assignments: []
    };
  }
  function createCrossSerializerContext(options) {
    return {
      mode: 2,
      base: createBaseSerializerContext(2, options),
      state: options,
      child: NIL
    };
  }
  var SerializePluginContext = class {
    constructor(_p) {
      this._p = _p;
    }
    serialize(node) {
      return serialize(this._p, node);
    }
  };
  function getVanillaRefParam(state, index) {
    let actualIndex = state.valid.get(index);
    if (actualIndex == null) {
      actualIndex = state.valid.size;
      state.valid.set(index, actualIndex);
    }
    let identifier = state.vars[actualIndex];
    if (identifier == null) {
      identifier = getIdentifier(actualIndex);
      state.vars[actualIndex] = identifier;
    }
    return identifier;
  }
  function getCrossRefParam(id) {
    return GLOBAL_CONTEXT_REFERENCES + "[" + id + "]";
  }
  function getRefParam(ctx, id) {
    return ctx.mode === 1 ? getVanillaRefParam(ctx.state, id) : getCrossRefParam(id);
  }
  function markSerializerRef(ctx, id) {
    ctx.marked.add(id);
  }
  function isSerializerRefMarked(ctx, id) {
    return ctx.marked.has(id);
  }
  function pushObjectFlag(ctx, flag, id) {
    if (flag !== 0) {
      markSerializerRef(ctx.base, id);
      ctx.base.flags.push({
        type: flag,
        value: getRefParam(ctx, id)
      });
    }
  }
  function resolveFlags(ctx) {
    let result = "";
    for (let i = 0, current = ctx.flags, len = current.length; i < len; i++) {
      const flag = current[i];
      result += OBJECT_FLAG_CONSTRUCTOR[flag.type] + "(" + flag.value + "),";
    }
    return result;
  }
  function resolvePatches(ctx) {
    const assignments = resolveAssignments(ctx.assignments);
    const flags = resolveFlags(ctx);
    if (assignments) {
      if (flags) {
        return assignments + flags;
      }
      return assignments;
    }
    return flags;
  }
  function createAssignment(ctx, source, value) {
    ctx.assignments.push({
      t: 0,
      s: source,
      k: NIL,
      v: value
    });
  }
  function createAddAssignment(ctx, ref, value) {
    ctx.base.assignments.push({
      t: 1,
      s: getRefParam(ctx, ref),
      k: NIL,
      v: value
    });
  }
  function createSetAssignment(ctx, ref, key, value) {
    ctx.base.assignments.push({
      t: 2,
      s: getRefParam(ctx, ref),
      k: key,
      v: value
    });
  }
  function createDeleteAssignment(ctx, ref, key) {
    ctx.base.assignments.push({
      t: 3,
      s: getRefParam(ctx, ref),
      k: key,
      v: NIL
    });
  }
  function createArrayAssign(ctx, ref, index, value) {
    createAssignment(ctx.base, getRefParam(ctx, ref) + "[" + index + "]", value);
  }
  function createObjectAssign(ctx, ref, key, value) {
    createAssignment(ctx.base, getRefParam(ctx, ref) + "." + key, value);
  }
  function createSequenceAssign(ctx, ref, index, value) {
    createAssignment(
      ctx.base,
      getRefParam(ctx, ref) + ".v[" + index + "]",
      value
    );
  }
  function isIndexedValueInStack(ctx, node) {
    return node.t === 4 && ctx.stack.includes(node.i);
  }
  function assignIndexedValue2(ctx, index, value) {
    if (ctx.mode === 1 && !isSerializerRefMarked(ctx.base, index)) {
      return value;
    }
    return getRefParam(ctx, index) + "=" + value;
  }
  function serializeReference(node) {
    return REFERENCES_KEY + '.get("' + node.s + '")';
  }
  function serializeArrayItem(ctx, id, item, index) {
    if (item) {
      if (isIndexedValueInStack(ctx.base, item)) {
        markSerializerRef(ctx.base, id);
        createArrayAssign(
          ctx,
          id,
          index,
          getRefParam(ctx, item.i)
        );
        return "";
      }
      return serialize(ctx, item);
    }
    return "";
  }
  function serializeArray(ctx, node) {
    const id = node.i;
    const list = node.a;
    const len = list.length;
    if (len > 0) {
      ctx.base.stack.push(id);
      let values = serializeArrayItem(ctx, id, list[0], 0);
      let isHoley = values === "";
      for (let i = 1, item; i < len; i++) {
        item = serializeArrayItem(ctx, id, list[i], i);
        values += "," + item;
        isHoley = item === "";
      }
      ctx.base.stack.pop();
      pushObjectFlag(ctx, node.o, node.i);
      return "[" + values + (isHoley ? ",]" : "]");
    }
    return "[]";
  }
  function serializeProperty(ctx, source, key, val) {
    if (typeof key === "string") {
      const check = Number(key);
      const isIdentifier = (
        // Test if key is a valid positive number or JS identifier
        // so that we don't have to serialize the key and wrap with brackets
        check >= 0 && // It's also important to consider that if the key is
        // indeed numeric, we need to make sure that when
        // converted back into a string, it's still the same
        // to the original key. This allows us to differentiate
        // keys that has numeric formats but in a different
        // format, which can cause unintentional key declaration
        // Example: { 0x1: 1 } vs { '0x1': 1 }
        check.toString() === key || isValidIdentifier(key)
      );
      if (isIndexedValueInStack(ctx.base, val)) {
        const refParam = getRefParam(ctx, val.i);
        markSerializerRef(ctx.base, source.i);
        if (isIdentifier && check !== check) {
          createObjectAssign(ctx, source.i, key, refParam);
        } else {
          createArrayAssign(
            ctx,
            source.i,
            isIdentifier ? key : '"' + key + '"',
            refParam
          );
        }
        return "";
      }
      return (isIdentifier ? key : '"' + key + '"') + ":" + serialize(ctx, val);
    }
    return "[" + serialize(ctx, key) + "]:" + serialize(ctx, val);
  }
  function serializeProperties(ctx, source, record) {
    const keys = record.k;
    const len = keys.length;
    if (len > 0) {
      const values = record.v;
      ctx.base.stack.push(source.i);
      let result = serializeProperty(ctx, source, keys[0], values[0]);
      for (let i = 1, item = result; i < len; i++) {
        item = serializeProperty(ctx, source, keys[i], values[i]);
        result += (item && result && ",") + item;
      }
      ctx.base.stack.pop();
      return "{" + result + "}";
    }
    return "{}";
  }
  function serializeObject(ctx, node) {
    pushObjectFlag(ctx, node.o, node.i);
    return serializeProperties(ctx, node, node.p);
  }
  function serializeWithObjectAssign(ctx, source, value, serialized) {
    const fields = serializeProperties(ctx, source, value);
    if (fields !== "{}") {
      return "Object.assign(" + serialized + "," + fields + ")";
    }
    return serialized;
  }
  function serializeStringKeyAssignment(ctx, source, mainAssignments, key, value) {
    const base = ctx.base;
    const serialized = serialize(ctx, value);
    const check = Number(key);
    const isIdentifier = (
      // Test if key is a valid positive number or JS identifier
      // so that we don't have to serialize the key and wrap with brackets
      check >= 0 && // It's also important to consider that if the key is
      // indeed numeric, we need to make sure that when
      // converted back into a string, it's still the same
      // to the original key. This allows us to differentiate
      // keys that has numeric formats but in a different
      // format, which can cause unintentional key declaration
      // Example: { 0x1: 1 } vs { '0x1': 1 }
      check.toString() === key || isValidIdentifier(key)
    );
    if (isIndexedValueInStack(base, value)) {
      if (isIdentifier && check !== check) {
        createObjectAssign(ctx, source.i, key, serialized);
      } else {
        createArrayAssign(
          ctx,
          source.i,
          isIdentifier ? key : '"' + key + '"',
          serialized
        );
      }
    } else {
      const parentAssignment = base.assignments;
      base.assignments = mainAssignments;
      if (isIdentifier && check !== check) {
        createObjectAssign(ctx, source.i, key, serialized);
      } else {
        createArrayAssign(
          ctx,
          source.i,
          isIdentifier ? key : '"' + key + '"',
          serialized
        );
      }
      base.assignments = parentAssignment;
    }
  }
  function serializeAssignment(ctx, source, mainAssignments, key, value) {
    if (typeof key === "string") {
      serializeStringKeyAssignment(ctx, source, mainAssignments, key, value);
    } else {
      const base = ctx.base;
      const parent = base.stack;
      base.stack = [];
      const serialized = serialize(ctx, value);
      base.stack = parent;
      const parentAssignment = base.assignments;
      base.assignments = mainAssignments;
      createArrayAssign(ctx, source.i, serialize(ctx, key), serialized);
      base.assignments = parentAssignment;
    }
  }
  function serializeAssignments(ctx, source, node) {
    const keys = node.k;
    const len = keys.length;
    if (len > 0) {
      const mainAssignments = [];
      const values = node.v;
      ctx.base.stack.push(source.i);
      for (let i = 0; i < len; i++) {
        serializeAssignment(ctx, source, mainAssignments, keys[i], values[i]);
      }
      ctx.base.stack.pop();
      return resolveAssignments(mainAssignments);
    }
    return NIL;
  }
  function serializeDictionary(ctx, node, init) {
    if (node.p) {
      const base = ctx.base;
      if (base.features & 8) {
        init = serializeWithObjectAssign(ctx, node, node.p, init);
      } else {
        markSerializerRef(base, node.i);
        const assignments = serializeAssignments(ctx, node, node.p);
        if (assignments) {
          return "(" + assignIndexedValue2(ctx, node.i, init) + "," + assignments + getRefParam(ctx, node.i) + ")";
        }
      }
    }
    return init;
  }
  function serializeNullConstructor(ctx, node) {
    pushObjectFlag(ctx, node.o, node.i);
    return serializeDictionary(ctx, node, NULL_CONSTRUCTOR);
  }
  function serializeDate(node) {
    return 'new Date("' + node.s + '")';
  }
  function serializeRegExp(ctx, node) {
    if (ctx.base.features & 32) {
      return "/" + node.c + "/" + node.m;
    }
    throw new SerovalUnsupportedNodeError(node);
  }
  function serializeSetItem(ctx, id, item) {
    const base = ctx.base;
    if (isIndexedValueInStack(base, item)) {
      markSerializerRef(base, id);
      createAddAssignment(
        ctx,
        id,
        getRefParam(ctx, item.i)
      );
      return "";
    }
    return serialize(ctx, item);
  }
  function serializeSet(ctx, node) {
    let serialized = SET_CONSTRUCTOR;
    const items = node.a;
    const size = items.length;
    const id = node.i;
    if (size > 0) {
      ctx.base.stack.push(id);
      let result = serializeSetItem(ctx, id, items[0]);
      for (let i = 1, item = result; i < size; i++) {
        item = serializeSetItem(ctx, id, items[i]);
        result += (item && result && ",") + item;
      }
      ctx.base.stack.pop();
      if (result) {
        serialized += "([" + result + "])";
      }
    }
    return serialized;
  }
  function serializeMapEntry(ctx, id, key, val, sentinel) {
    const base = ctx.base;
    if (isIndexedValueInStack(base, key)) {
      const keyRef = getRefParam(ctx, key.i);
      markSerializerRef(base, id);
      if (isIndexedValueInStack(base, val)) {
        const valueRef = getRefParam(ctx, val.i);
        createSetAssignment(ctx, id, keyRef, valueRef);
        return "";
      }
      if (val.t !== 4 && val.i != null && isSerializerRefMarked(base, val.i)) {
        const serialized = "(" + serialize(ctx, val) + ",[" + sentinel + "," + sentinel + "])";
        createSetAssignment(ctx, id, keyRef, getRefParam(ctx, val.i));
        createDeleteAssignment(ctx, id, sentinel);
        return serialized;
      }
      const parent = base.stack;
      base.stack = [];
      createSetAssignment(ctx, id, keyRef, serialize(ctx, val));
      base.stack = parent;
      return "";
    }
    if (isIndexedValueInStack(base, val)) {
      const valueRef = getRefParam(ctx, val.i);
      markSerializerRef(base, id);
      if (key.t !== 4 && key.i != null && isSerializerRefMarked(base, key.i)) {
        const serialized = "(" + serialize(ctx, key) + ",[" + sentinel + "," + sentinel + "])";
        createSetAssignment(ctx, id, getRefParam(ctx, key.i), valueRef);
        createDeleteAssignment(ctx, id, sentinel);
        return serialized;
      }
      const parent = base.stack;
      base.stack = [];
      createSetAssignment(ctx, id, serialize(ctx, key), valueRef);
      base.stack = parent;
      return "";
    }
    return "[" + serialize(ctx, key) + "," + serialize(ctx, val) + "]";
  }
  function serializeMap(ctx, node) {
    let serialized = MAP_CONSTRUCTOR;
    const keys = node.e.k;
    const size = keys.length;
    const id = node.i;
    const sentinel = node.f;
    const sentinelId = getRefParam(ctx, sentinel.i);
    const base = ctx.base;
    if (size > 0) {
      const vals = node.e.v;
      base.stack.push(id);
      let result = serializeMapEntry(ctx, id, keys[0], vals[0], sentinelId);
      for (let i = 1, item = result; i < size; i++) {
        item = serializeMapEntry(ctx, id, keys[i], vals[i], sentinelId);
        result += (item && result && ",") + item;
      }
      base.stack.pop();
      if (result) {
        serialized += "([" + result + "])";
      }
    }
    if (sentinel.t === 26) {
      markSerializerRef(base, sentinel.i);
      serialized = "(" + serialize(ctx, sentinel) + "," + serialized + ")";
    }
    return serialized;
  }
  function serializeArrayBuffer(ctx, node) {
    return getConstructor(ctx, node.f) + '("' + node.s + '")';
  }
  function serializeTypedArray(ctx, node) {
    return "new " + node.c + "(" + serialize(ctx, node.f) + "," + node.b + "," + node.l + ")";
  }
  function serializeDataView(ctx, node) {
    return "new DataView(" + serialize(ctx, node.f) + "," + node.b + "," + node.l + ")";
  }
  function serializeAggregateError(ctx, node) {
    const id = node.i;
    ctx.base.stack.push(id);
    const serialized = serializeDictionary(
      ctx,
      node,
      'new AggregateError([],"' + node.m + '")'
    );
    ctx.base.stack.pop();
    return serialized;
  }
  function serializeError(ctx, node) {
    return serializeDictionary(
      ctx,
      node,
      "new " + ERROR_CONSTRUCTOR_STRING[node.s] + '("' + node.m + '")'
    );
  }
  function serializePromise(ctx, node) {
    let serialized;
    const fulfilled = node.f;
    const id = node.i;
    const promiseConstructor = node.s ? PROMISE_RESOLVE : PROMISE_REJECT;
    const base = ctx.base;
    if (isIndexedValueInStack(base, fulfilled)) {
      const ref = getRefParam(ctx, fulfilled.i);
      serialized = promiseConstructor + (node.s ? "().then(" + createFunction([], ref) + ")" : "().catch(" + createEffectfulFunction([], "throw " + ref) + ")");
    } else {
      base.stack.push(id);
      const result = serialize(ctx, fulfilled);
      base.stack.pop();
      serialized = promiseConstructor + "(" + result + ")";
    }
    return serialized;
  }
  function serializeBoxed(ctx, node) {
    return "Object(" + serialize(ctx, node.f) + ")";
  }
  function getConstructor(ctx, node) {
    const current = serialize(ctx, node);
    return node.t === 4 ? current : "(" + current + ")";
  }
  function serializePromiseConstructor(ctx, node) {
    if (ctx.mode === 1) {
      throw new SerovalUnsupportedNodeError(node);
    }
    const resolver = assignIndexedValue2(
      ctx,
      node.s,
      getConstructor(ctx, node.f) + "()"
    );
    return "(" + resolver + ").p";
  }
  function serializePromiseResolve(ctx, node) {
    if (ctx.mode === 1) {
      throw new SerovalUnsupportedNodeError(node);
    }
    return getConstructor(ctx, node.a[0]) + "(" + getRefParam(ctx, node.i) + "," + serialize(ctx, node.a[1]) + ")";
  }
  function serializePromiseReject(ctx, node) {
    if (ctx.mode === 1) {
      throw new SerovalUnsupportedNodeError(node);
    }
    return getConstructor(ctx, node.a[0]) + "(" + getRefParam(ctx, node.i) + "," + serialize(ctx, node.a[1]) + ")";
  }
  function serializePlugin(ctx, node) {
    const currentPlugins = ctx.base.plugins;
    if (currentPlugins) {
      for (let i = 0, len = currentPlugins.length; i < len; i++) {
        const plugin = currentPlugins[i];
        if (plugin.tag === node.c) {
          if (ctx.child == null) {
            ctx.child = new SerializePluginContext(ctx);
          }
          return plugin.serialize(node.s, ctx.child, {
            id: node.i
          });
        }
      }
    }
    throw new SerovalMissingPluginError(node.c);
  }
  function serializeIteratorFactory(ctx, node) {
    let result = "";
    let initialized = false;
    if (node.f.t !== 4) {
      markSerializerRef(ctx.base, node.f.i);
      result = "(" + serialize(ctx, node.f) + ",";
      initialized = true;
    }
    result += assignIndexedValue2(
      ctx,
      node.i,
      "(" + SERIALIZED_ITERATOR_CONSTRUCTOR + ")(" + getRefParam(ctx, node.f.i) + ")"
    );
    if (initialized) {
      result += ")";
    }
    return result;
  }
  function serializeIteratorFactoryInstance(ctx, node) {
    return getConstructor(ctx, node.a[0]) + "(" + serialize(ctx, node.a[1]) + ")";
  }
  function serializeAsyncIteratorFactory(ctx, node) {
    const promise = node.a[0];
    const symbol = node.a[1];
    const base = ctx.base;
    let result = "";
    if (promise.t !== 4) {
      markSerializerRef(base, promise.i);
      result += "(" + serialize(ctx, promise);
    }
    if (symbol.t !== 4) {
      markSerializerRef(base, symbol.i);
      result += (result ? "," : "(") + serialize(ctx, symbol);
    }
    if (result) {
      result += ",";
    }
    const iterator = assignIndexedValue2(
      ctx,
      node.i,
      "(" + SERIALIZED_ASYNC_ITERATOR_CONSTRUCTOR + ")(" + getRefParam(ctx, symbol.i) + "," + getRefParam(ctx, promise.i) + ")"
    );
    if (result) {
      return result + iterator + ")";
    }
    return iterator;
  }
  function serializeAsyncIteratorFactoryInstance(ctx, node) {
    return getConstructor(ctx, node.a[0]) + "(" + serialize(ctx, node.a[1]) + ")";
  }
  function serializeStreamConstructor(ctx, node) {
    const result = assignIndexedValue2(
      ctx,
      node.i,
      getConstructor(ctx, node.f) + "()"
    );
    const len = node.a.length;
    if (len) {
      let values = serialize(ctx, node.a[0]);
      for (let i = 1; i < len; i++) {
        values += "," + serialize(ctx, node.a[i]);
      }
      return "(" + result + "," + values + "," + getRefParam(ctx, node.i) + ")";
    }
    return result;
  }
  function serializeStreamNext(ctx, node) {
    return getRefParam(ctx, node.i) + ".next(" + serialize(ctx, node.f) + ")";
  }
  function serializeStreamThrow(ctx, node) {
    return getRefParam(ctx, node.i) + ".throw(" + serialize(ctx, node.f) + ")";
  }
  function serializeStreamReturn(ctx, node) {
    return getRefParam(ctx, node.i) + ".return(" + serialize(ctx, node.f) + ")";
  }
  function serializeSequenceItem(ctx, id, index, item) {
    const base = ctx.base;
    if (isIndexedValueInStack(base, item)) {
      markSerializerRef(base, id);
      createSequenceAssign(
        ctx,
        id,
        index,
        getRefParam(ctx, item.i)
      );
      return "";
    }
    return serialize(ctx, item);
  }
  function serializeSequence(ctx, node) {
    const items = node.a;
    const size = items.length;
    const id = node.i;
    if (size > 0) {
      ctx.base.stack.push(id);
      let result = serializeSequenceItem(ctx, id, 0, items[0]);
      for (let i = 1, item = result; i < size; i++) {
        item = serializeSequenceItem(ctx, id, i, items[i]);
        result += (item && result && ",") + item;
      }
      ctx.base.stack.pop();
      if (result) {
        return "{__SEROVAL_SEQUENCE__:!0,v:[" + result + "],t:" + node.s + ",d:" + node.l + "}";
      }
    }
    return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
  }
  function serializeAssignable(ctx, node) {
    switch (node.t) {
      case 17:
        return SYMBOL_STRING[node.s];
      case 18:
        return serializeReference(node);
      case 9:
        return serializeArray(ctx, node);
      case 10:
        return serializeObject(ctx, node);
      case 11:
        return serializeNullConstructor(ctx, node);
      case 5:
        return serializeDate(node);
      case 6:
        return serializeRegExp(ctx, node);
      case 7:
        return serializeSet(ctx, node);
      case 8:
        return serializeMap(ctx, node);
      case 19:
        return serializeArrayBuffer(ctx, node);
      case 16:
      case 15:
        return serializeTypedArray(ctx, node);
      case 20:
        return serializeDataView(ctx, node);
      case 14:
        return serializeAggregateError(ctx, node);
      case 13:
        return serializeError(ctx, node);
      case 12:
        return serializePromise(ctx, node);
      case 21:
        return serializeBoxed(ctx, node);
      case 22:
        return serializePromiseConstructor(ctx, node);
      case 25:
        return serializePlugin(ctx, node);
      case 26:
        return SPECIAL_REF_STRING[node.s];
      case 35:
        return serializeSequence(ctx, node);
      default:
        throw new SerovalUnsupportedNodeError(node);
    }
  }
  function serialize(ctx, node) {
    switch (node.t) {
      case 2:
        return CONSTANT_STRING[node.s];
      case 0:
        return "" + node.s;
      case 1:
        return '"' + node.s + '"';
      case 3:
        return node.s + "n";
      case 4:
        return getRefParam(ctx, node.i);
      case 23:
        return serializePromiseResolve(ctx, node);
      case 24:
        return serializePromiseReject(ctx, node);
      case 27:
        return serializeIteratorFactory(ctx, node);
      case 28:
        return serializeIteratorFactoryInstance(ctx, node);
      case 29:
        return serializeAsyncIteratorFactory(ctx, node);
      case 30:
        return serializeAsyncIteratorFactoryInstance(ctx, node);
      case 31:
        return serializeStreamConstructor(ctx, node);
      case 32:
        return serializeStreamNext(ctx, node);
      case 33:
        return serializeStreamThrow(ctx, node);
      case 34:
        return serializeStreamReturn(ctx, node);
      default:
        return assignIndexedValue2(ctx, node.i, serializeAssignable(ctx, node));
    }
  }
  function serializeTopCross(ctx, tree) {
    const result = serialize(ctx, tree);
    const id = tree.i;
    if (id == null) {
      return result;
    }
    const patches = resolvePatches(ctx.base);
    const ref = getRefParam(ctx, id);
    const scopeId = ctx.state.scopeId;
    const params = scopeId == null ? "" : GLOBAL_CONTEXT_REFERENCES;
    const body = patches ? "(" + result + "," + patches + ref + ")" : result;
    if (params === "") {
      if (tree.t === 10 && !patches) {
        return "(" + body + ")";
      }
      return body;
    }
    const args = scopeId == null ? "()" : "(" + GLOBAL_CONTEXT_REFERENCES + '["' + serializeString(scopeId) + '"])';
    return "(" + createFunction([params], body) + ")" + args;
  }
  var SyncParsePluginContext = class {
    constructor(_p, depth) {
      this._p = _p;
      this.depth = depth;
    }
    parse(current) {
      return parseSOS(this._p, this.depth, current);
    }
  };
  var StreamParsePluginContext = class {
    constructor(_p, depth) {
      this._p = _p;
      this.depth = depth;
    }
    parse(current) {
      return parseSOS(this._p, this.depth, current);
    }
    parseWithError(current) {
      return parseWithError(this._p, this.depth, current);
    }
    isAlive() {
      return this._p.state.alive;
    }
    pushPendingState() {
      pushPendingState(this._p);
    }
    popPendingState() {
      popPendingState(this._p);
    }
    onParse(node) {
      onParse(this._p, node);
    }
    onError(error) {
      onError(this._p, error);
    }
  };
  function createStreamParserState(options) {
    return {
      alive: true,
      pending: 0,
      initial: true,
      buffer: [],
      onParse: options.onParse,
      onError: options.onError,
      onDone: options.onDone
    };
  }
  function createStreamParserContext(options) {
    return {
      type: 2,
      base: createBaseParserContext(2, options),
      state: createStreamParserState(options)
    };
  }
  function parseItems2(ctx, depth, current) {
    const nodes = [];
    for (let i = 0, len = current.length; i < len; i++) {
      if (i in current) {
        nodes[i] = parseSOS(ctx, depth, current[i]);
      } else {
        nodes[i] = 0;
      }
    }
    return nodes;
  }
  function parseArray2(ctx, depth, id, current) {
    return createArrayNode(id, current, parseItems2(ctx, depth, current));
  }
  function parseProperties2(ctx, depth, properties) {
    const entries = Object.entries(properties);
    const keyNodes = [];
    const valueNodes = [];
    for (let i = 0, len = entries.length; i < len; i++) {
      keyNodes.push(serializeString(entries[i][0]));
      valueNodes.push(parseSOS(ctx, depth, entries[i][1]));
    }
    if (SYM_ITERATOR in properties) {
      keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ITERATOR));
      valueNodes.push(
        createIteratorFactoryInstanceNode(
          parseIteratorFactory(ctx.base),
          parseSOS(
            ctx,
            depth,
            createSequenceFromIterable(
              properties
            )
          )
        )
      );
    }
    if (SYM_ASYNC_ITERATOR in properties) {
      keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ASYNC_ITERATOR));
      valueNodes.push(
        createAsyncIteratorFactoryInstanceNode(
          parseAsyncIteratorFactory(ctx.base),
          parseSOS(
            ctx,
            depth,
            ctx.type === 1 ? createStream() : createStreamFromAsyncIterable(
              properties
            )
          )
        )
      );
    }
    if (SYM_TO_STRING_TAG in properties) {
      keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_TO_STRING_TAG));
      valueNodes.push(createStringNode(properties[SYM_TO_STRING_TAG]));
    }
    if (SYM_IS_CONCAT_SPREADABLE in properties) {
      keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_IS_CONCAT_SPREADABLE));
      valueNodes.push(
        properties[SYM_IS_CONCAT_SPREADABLE] ? TRUE_NODE : FALSE_NODE
      );
    }
    return {
      k: keyNodes,
      v: valueNodes
    };
  }
  function parsePlainObject2(ctx, depth, id, current, empty) {
    return createObjectNode(
      id,
      current,
      empty,
      parseProperties2(ctx, depth, current)
    );
  }
  function parseBoxed2(ctx, depth, id, current) {
    return createBoxedNode(id, parseSOS(ctx, depth, current.valueOf()));
  }
  function parseTypedArray2(ctx, depth, id, current) {
    return createTypedArrayNode(
      id,
      current,
      parseSOS(ctx, depth, current.buffer)
    );
  }
  function parseBigIntTypedArray2(ctx, depth, id, current) {
    return createBigIntTypedArrayNode(
      id,
      current,
      parseSOS(ctx, depth, current.buffer)
    );
  }
  function parseDataView2(ctx, depth, id, current) {
    return createDataViewNode(id, current, parseSOS(ctx, depth, current.buffer));
  }
  function parseError2(ctx, depth, id, current) {
    const options = getErrorOptions(current, ctx.base.features);
    return createErrorNode(
      id,
      current,
      options ? parseProperties2(ctx, depth, options) : NIL
    );
  }
  function parseAggregateError2(ctx, depth, id, current) {
    const options = getErrorOptions(current, ctx.base.features);
    return createAggregateErrorNode(
      id,
      current,
      options ? parseProperties2(ctx, depth, options) : NIL
    );
  }
  function parseMap2(ctx, depth, id, current) {
    const keyNodes = [];
    const valueNodes = [];
    for (const [key, value] of current.entries()) {
      keyNodes.push(parseSOS(ctx, depth, key));
      valueNodes.push(parseSOS(ctx, depth, value));
    }
    return createMapNode(ctx.base, id, keyNodes, valueNodes);
  }
  function parseSet2(ctx, depth, id, current) {
    const items = [];
    for (const item of current.keys()) {
      items.push(parseSOS(ctx, depth, item));
    }
    return createSetNode(id, items);
  }
  function parseStream2(ctx, depth, id, current) {
    const result = createStreamConstructorNode(
      id,
      parseSpecialReference(
        ctx.base,
        4
        /* StreamConstructor */
      ),
      []
    );
    if (ctx.type === 1) {
      return result;
    }
    pushPendingState(ctx);
    current.on({
      next: (value) => {
        if (ctx.state.alive) {
          const parsed = parseWithError(ctx, depth, value);
          if (parsed) {
            onParse(ctx, createStreamNextNode(id, parsed));
          }
        }
      },
      throw: (value) => {
        if (ctx.state.alive) {
          const parsed = parseWithError(ctx, depth, value);
          if (parsed) {
            onParse(ctx, createStreamThrowNode(id, parsed));
          }
        }
        popPendingState(ctx);
      },
      return: (value) => {
        if (ctx.state.alive) {
          const parsed = parseWithError(ctx, depth, value);
          if (parsed) {
            onParse(ctx, createStreamReturnNode(id, parsed));
          }
        }
        popPendingState(ctx);
      }
    });
    return result;
  }
  function handlePromiseSuccess(id, depth, data) {
    if (this.state.alive) {
      const parsed = parseWithError(this, depth, data);
      if (parsed) {
        onParse(
          this,
          createSerovalNode(
            23,
            id,
            NIL,
            NIL,
            NIL,
            NIL,
            NIL,
            [
              parseSpecialReference(
                this.base,
                2
                /* PromiseSuccess */
              ),
              parsed
            ],
            NIL,
            NIL,
            NIL,
            NIL
          )
        );
      }
      popPendingState(this);
    }
  }
  function handlePromiseFailure(id, depth, data) {
    if (this.state.alive) {
      const parsed = parseWithError(this, depth, data);
      if (parsed) {
        onParse(
          this,
          createSerovalNode(
            24,
            id,
            NIL,
            NIL,
            NIL,
            NIL,
            NIL,
            [
              parseSpecialReference(
                this.base,
                3
                /* PromiseFailure */
              ),
              parsed
            ],
            NIL,
            NIL,
            NIL,
            NIL
          )
        );
      }
    }
    popPendingState(this);
  }
  function parsePromise2(ctx, depth, id, current) {
    const resolver = createIndexForValue(ctx.base, {});
    if (ctx.type === 2) {
      pushPendingState(ctx);
      current.then(
        handlePromiseSuccess.bind(ctx, resolver, depth),
        handlePromiseFailure.bind(ctx, resolver, depth)
      );
    }
    return createPromiseConstructorNode(ctx.base, id, resolver);
  }
  function parsePluginSync(ctx, depth, id, current, currentPlugins) {
    for (let i = 0, len = currentPlugins.length; i < len; i++) {
      const plugin = currentPlugins[i];
      if (plugin.parse.sync && plugin.test(current)) {
        return createPluginNode(
          id,
          plugin.tag,
          plugin.parse.sync(current, new SyncParsePluginContext(ctx, depth), {
            id
          })
        );
      }
    }
    return NIL;
  }
  function parsePluginStream(ctx, depth, id, current, currentPlugins) {
    for (let i = 0, len = currentPlugins.length; i < len; i++) {
      const plugin = currentPlugins[i];
      if (plugin.parse.stream && plugin.test(current)) {
        return createPluginNode(
          id,
          plugin.tag,
          plugin.parse.stream(current, new StreamParsePluginContext(ctx, depth), {
            id
          })
        );
      }
    }
    return NIL;
  }
  function parsePlugin2(ctx, depth, id, current) {
    const currentPlugins = ctx.base.plugins;
    if (currentPlugins) {
      return ctx.type === 1 ? parsePluginSync(ctx, depth, id, current, currentPlugins) : parsePluginStream(ctx, depth, id, current, currentPlugins);
    }
    return NIL;
  }
  function parseSequence2(ctx, depth, id, current) {
    const nodes = [];
    for (let i = 0, len = current.v.length; i < len; i++) {
      nodes[i] = parseSOS(ctx, depth, current.v[i]);
    }
    return createSequenceNode(id, nodes, current.t, current.d);
  }
  function parseObjectPhase2(ctx, depth, id, current, currentClass) {
    switch (currentClass) {
      case Object:
        return parsePlainObject2(
          ctx,
          depth,
          id,
          current,
          false
        );
      case NIL:
        return parsePlainObject2(
          ctx,
          depth,
          id,
          current,
          true
        );
      case Date:
        return createDateNode(id, current);
      case Error:
      case EvalError:
      case RangeError:
      case ReferenceError:
      case SyntaxError:
      case TypeError:
      case URIError:
        return parseError2(ctx, depth, id, current);
      case Number:
      case Boolean:
      case String:
      case BigInt:
        return parseBoxed2(ctx, depth, id, current);
      case ArrayBuffer:
        return createArrayBufferNode(
          ctx.base,
          id,
          current
        );
      case Int8Array:
      case Int16Array:
      case Int32Array:
      case Uint8Array:
      case Uint16Array:
      case Uint32Array:
      case Uint8ClampedArray:
      case Float32Array:
      case Float64Array:
        return parseTypedArray2(
          ctx,
          depth,
          id,
          current
        );
      case DataView:
        return parseDataView2(ctx, depth, id, current);
      case Map:
        return parseMap2(
          ctx,
          depth,
          id,
          current
        );
      case Set:
        return parseSet2(ctx, depth, id, current);
      default:
        break;
    }
    if (currentClass === Promise || current instanceof Promise) {
      return parsePromise2(ctx, depth, id, current);
    }
    const currentFeatures = ctx.base.features;
    if (currentFeatures & 32 && currentClass === RegExp) {
      return createRegExpNode(id, current);
    }
    if (currentFeatures & 16) {
      switch (currentClass) {
        case BigInt64Array:
        case BigUint64Array:
          return parseBigIntTypedArray2(
            ctx,
            depth,
            id,
            current
          );
        default:
          break;
      }
    }
    if (currentFeatures & 1 && typeof AggregateError !== "undefined" && (currentClass === AggregateError || current instanceof AggregateError)) {
      return parseAggregateError2(
        ctx,
        depth,
        id,
        current
      );
    }
    if (current instanceof Error) {
      return parseError2(ctx, depth, id, current);
    }
    if (SYM_ITERATOR in current || SYM_ASYNC_ITERATOR in current) {
      return parsePlainObject2(ctx, depth, id, current, !!currentClass);
    }
    throw new SerovalUnsupportedTypeError(current);
  }
  function parseObject(ctx, depth, id, current) {
    if (Array.isArray(current)) {
      return parseArray2(ctx, depth, id, current);
    }
    if (isStream(current)) {
      return parseStream2(ctx, depth, id, current);
    }
    if (isSequence(current)) {
      return parseSequence2(ctx, depth, id, current);
    }
    const currentClass = current.constructor;
    if (currentClass === OpaqueReference) {
      return parseSOS(
        ctx,
        depth,
        current.replacement
      );
    }
    const parsed = parsePlugin2(ctx, depth, id, current);
    if (parsed) {
      return parsed;
    }
    return parseObjectPhase2(ctx, depth, id, current, currentClass);
  }
  function parseFunction(ctx, depth, current) {
    const ref = getReferenceNode(ctx.base, current);
    if (ref.type !== 0) {
      return ref.value;
    }
    const plugin = parsePlugin2(ctx, depth, ref.value, current);
    if (plugin) {
      return plugin;
    }
    throw new SerovalUnsupportedTypeError(current);
  }
  function parseSOS(ctx, depth, current) {
    if (depth >= ctx.base.depthLimit) {
      throw new SerovalDepthLimitError(ctx.base.depthLimit);
    }
    switch (typeof current) {
      case "boolean":
        return current ? TRUE_NODE : FALSE_NODE;
      case "undefined":
        return UNDEFINED_NODE;
      case "string":
        return createStringNode(current);
      case "number":
        return createNumberNode(current);
      case "bigint":
        return createBigIntNode(current);
      case "object": {
        if (current) {
          const ref = getReferenceNode(ctx.base, current);
          return ref.type === 0 ? parseObject(ctx, depth + 1, ref.value, current) : ref.value;
        }
        return NULL_NODE;
      }
      case "symbol":
        return parseWellKnownSymbol(ctx.base, current);
      case "function": {
        return parseFunction(ctx, depth, current);
      }
      default:
        throw new SerovalUnsupportedTypeError(current);
    }
  }
  function onParse(ctx, node) {
    if (ctx.state.initial) {
      ctx.state.buffer.push(node);
    } else {
      onParseInternal(ctx, node, false);
    }
  }
  function onError(ctx, error) {
    if (ctx.state.onError) {
      ctx.state.onError(error);
    } else {
      throw error instanceof SerovalParserError ? error : new SerovalParserError(error);
    }
  }
  function onDone(ctx) {
    if (ctx.state.onDone) {
      ctx.state.onDone();
    }
  }
  function onParseInternal(ctx, node, initial) {
    try {
      ctx.state.onParse(node, initial);
    } catch (error) {
      onError(ctx, error);
    }
  }
  function pushPendingState(ctx) {
    ctx.state.pending++;
  }
  function popPendingState(ctx) {
    if (--ctx.state.pending <= 0) {
      onDone(ctx);
    }
  }
  function parseWithError(ctx, depth, current) {
    try {
      return parseSOS(ctx, depth, current);
    } catch (err) {
      onError(ctx, err);
      return NIL;
    }
  }
  function startStreamParse(ctx, current) {
    const parsed = parseWithError(ctx, 0, current);
    if (parsed) {
      onParseInternal(ctx, parsed, true);
      ctx.state.initial = false;
      flushStreamParse(ctx, ctx.state);
      if (ctx.state.pending <= 0) {
        destroyStreamParse(ctx);
      }
    }
  }
  function flushStreamParse(ctx, state) {
    for (let i = 0, len = state.buffer.length; i < len; i++) {
      onParseInternal(ctx, state.buffer[i], false);
    }
  }
  function destroyStreamParse(ctx) {
    if (ctx.state.alive) {
      onDone(ctx);
      ctx.state.alive = false;
    }
  }
  function crossSerializeStream(source, options) {
    const plugins = resolvePlugins(options.plugins);
    const ctx = createStreamParserContext({
      plugins,
      refs: options.refs,
      disabledFeatures: options.disabledFeatures,
      onParse(node, initial) {
        const serial = createCrossSerializerContext({
          plugins,
          features: ctx.base.features,
          scopeId: options.scopeId,
          markedRefs: ctx.base.marked
        });
        let serialized;
        try {
          serialized = serializeTopCross(serial, node);
        } catch (err) {
          if (options.onError) {
            options.onError(err);
          }
          return;
        }
        options.onSerialize(serialized, initial);
      },
      onError: options.onError,
      onDone: options.onDone
    });
    startStreamParse(ctx, source);
    return destroyStreamParse.bind(null, ctx);
  }
  var Serializer = class {
    constructor(options) {
      this.options = options;
      this.alive = true;
      this.flushed = false;
      this.done = false;
      this.pending = 0;
      this.cleanups = [];
      this.refs = /* @__PURE__ */ new Map();
      this.keys = /* @__PURE__ */ new Set();
      this.ids = 0;
      this.plugins = resolvePlugins(options.plugins);
    }
    write(key, value) {
      if (this.alive && !this.flushed) {
        this.pending++;
        this.keys.add(key);
        this.cleanups.push(
          crossSerializeStream(value, {
            plugins: this.plugins,
            scopeId: this.options.scopeId,
            refs: this.refs,
            disabledFeatures: this.options.disabledFeatures,
            onError: this.options.onError,
            onSerialize: (data, initial) => {
              if (this.alive) {
                this.options.onData(
                  initial ? this.options.globalIdentifier + '["' + serializeString(key) + '"]=' + data : data
                );
              }
            },
            onDone: () => {
              if (this.alive) {
                this.pending--;
                if (this.pending <= 0 && this.flushed && !this.done && this.options.onDone) {
                  this.options.onDone();
                  this.done = true;
                }
              }
            }
          })
        );
      }
    }
    getNextID() {
      while (this.keys.has("" + this.ids)) {
        this.ids++;
      }
      return "" + this.ids;
    }
    push(value) {
      const newID = this.getNextID();
      this.write(newID, value);
      return newID;
    }
    flush() {
      if (this.alive) {
        this.flushed = true;
        if (this.pending <= 0 && !this.done && this.options.onDone) {
          this.options.onDone();
          this.done = true;
        }
      }
    }
    close() {
      if (this.alive) {
        for (let i = 0, len = this.cleanups.length; i < len; i++) {
          this.cleanups[i]();
        }
        if (!this.done && this.options.onDone) {
          this.options.onDone();
          this.done = true;
        }
        this.alive = false;
      }
    }
  };

  // node_modules/.pnpm/seroval-plugins@1.5.4_seroval@1.5.4/node_modules/seroval-plugins/dist/esm/development/web.mjs
  var PROMISE_TO_ABORT_SIGNAL = (promise) => {
    const controller = new AbortController();
    const abort = controller.abort.bind(controller);
    promise.then(abort, abort);
    return controller;
  };
  function resolveAbortSignalResult(resolve) {
    resolve(this.reason);
  }
  function resolveAbortSignal(resolve) {
    this.addEventListener("abort", resolveAbortSignalResult.bind(this, resolve), {
      once: true
    });
  }
  function abortSignalToPromise(signal) {
    return new Promise(resolveAbortSignal.bind(signal));
  }
  var ABORT_CONTROLLER = {};
  var AbortControllerFactoryPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/AbortControllerFactoryPlugin",
    test(value) {
      return value === ABORT_CONTROLLER;
    },
    parse: {
      sync() {
        return ABORT_CONTROLLER;
      },
      async async() {
        return await Promise.resolve(ABORT_CONTROLLER);
      },
      stream() {
        return ABORT_CONTROLLER;
      }
    },
    serialize() {
      return PROMISE_TO_ABORT_SIGNAL.toString();
    },
    deserialize() {
      return PROMISE_TO_ABORT_SIGNAL;
    }
  });
  var AbortSignalPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/AbortSignal",
    extends: [AbortControllerFactoryPlugin],
    test(value) {
      if (typeof AbortSignal === "undefined") {
        return false;
      }
      return value instanceof AbortSignal;
    },
    parse: {
      sync(value, ctx) {
        if (value.aborted) {
          return {
            reason: ctx.parse(value.reason)
          };
        }
        return {};
      },
      async async(value, ctx) {
        if (value.aborted) {
          return {
            reason: await ctx.parse(value.reason)
          };
        }
        const result = await abortSignalToPromise(value);
        return {
          reason: await ctx.parse(result)
        };
      },
      stream(value, ctx) {
        if (value.aborted) {
          return {
            reason: ctx.parse(value.reason)
          };
        }
        const promise = abortSignalToPromise(value);
        return {
          factory: ctx.parse(ABORT_CONTROLLER),
          controller: ctx.parse(promise)
        };
      }
    },
    serialize(node, ctx) {
      if (node.reason) {
        return "AbortSignal.abort(" + ctx.serialize(node.reason) + ")";
      }
      if (node.controller && node.factory) {
        return "(" + ctx.serialize(node.factory) + ")(" + ctx.serialize(node.controller) + ").signal";
      }
      return "(new AbortController).signal";
    },
    deserialize(node, ctx) {
      if (node.reason) {
        return AbortSignal.abort(ctx.deserialize(node.reason));
      }
      if (node.controller) {
        return PROMISE_TO_ABORT_SIGNAL(ctx.deserialize(node.controller)).signal;
      }
      const controller = new AbortController();
      return controller.signal;
    }
  });
  var abort_signal_default = AbortSignalPlugin;
  function createCustomEventOptions(current) {
    return {
      detail: current.detail,
      bubbles: current.bubbles,
      cancelable: current.cancelable,
      composed: current.composed
    };
  }
  var CustomEventPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/CustomEvent",
    test(value) {
      if (typeof CustomEvent === "undefined") {
        return false;
      }
      return value instanceof CustomEvent;
    },
    parse: {
      sync(value, ctx) {
        return {
          type: ctx.parse(value.type),
          options: ctx.parse(createCustomEventOptions(value))
        };
      },
      async async(value, ctx) {
        return {
          type: await ctx.parse(value.type),
          options: await ctx.parse(createCustomEventOptions(value))
        };
      },
      stream(value, ctx) {
        return {
          type: ctx.parse(value.type),
          options: ctx.parse(createCustomEventOptions(value))
        };
      }
    },
    serialize(node, ctx) {
      return "new CustomEvent(" + ctx.serialize(node.type) + "," + ctx.serialize(node.options) + ")";
    },
    deserialize(node, ctx) {
      return new CustomEvent(
        ctx.deserialize(node.type),
        ctx.deserialize(node.options)
      );
    }
  });
  var custom_event_default = CustomEventPlugin;
  var DOMExceptionPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/DOMException",
    test(value) {
      if (typeof DOMException === "undefined") {
        return false;
      }
      return value instanceof DOMException;
    },
    parse: {
      sync(value, ctx) {
        return {
          name: ctx.parse(value.name),
          message: ctx.parse(value.message)
        };
      },
      async async(value, ctx) {
        return {
          name: await ctx.parse(value.name),
          message: await ctx.parse(value.message)
        };
      },
      stream(value, ctx) {
        return {
          name: ctx.parse(value.name),
          message: ctx.parse(value.message)
        };
      }
    },
    serialize(node, ctx) {
      return "new DOMException(" + ctx.serialize(node.message) + "," + ctx.serialize(node.name) + ")";
    },
    deserialize(node, ctx) {
      return new DOMException(
        ctx.deserialize(node.message),
        ctx.deserialize(node.name)
      );
    }
  });
  var dom_exception_default = DOMExceptionPlugin;
  function createEventOptions(current) {
    return {
      bubbles: current.bubbles,
      cancelable: current.cancelable,
      composed: current.composed
    };
  }
  var EventPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/Event",
    test(value) {
      if (typeof Event === "undefined") {
        return false;
      }
      return value instanceof Event;
    },
    parse: {
      sync(value, ctx) {
        return {
          type: ctx.parse(value.type),
          options: ctx.parse(createEventOptions(value))
        };
      },
      async async(value, ctx) {
        return {
          type: await ctx.parse(value.type),
          options: await ctx.parse(createEventOptions(value))
        };
      },
      stream(value, ctx) {
        return {
          type: ctx.parse(value.type),
          options: ctx.parse(createEventOptions(value))
        };
      }
    },
    serialize(node, ctx) {
      return "new Event(" + ctx.serialize(node.type) + "," + ctx.serialize(node.options) + ")";
    },
    deserialize(node, ctx) {
      return new Event(
        ctx.deserialize(node.type),
        ctx.deserialize(node.options)
      );
    }
  });
  var event_default = EventPlugin;
  var FilePlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/File",
    test(value) {
      if (typeof File === "undefined") {
        return false;
      }
      return value instanceof File;
    },
    parse: {
      async async(value, ctx) {
        return {
          name: await ctx.parse(value.name),
          options: await ctx.parse({
            type: value.type,
            lastModified: value.lastModified
          }),
          buffer: await ctx.parse(await value.arrayBuffer())
        };
      }
    },
    serialize(node, ctx) {
      return "new File([" + ctx.serialize(node.buffer) + "]," + ctx.serialize(node.name) + "," + ctx.serialize(node.options) + ")";
    },
    deserialize(node, ctx) {
      return new File(
        [ctx.deserialize(node.buffer)],
        ctx.deserialize(node.name),
        ctx.deserialize(node.options)
      );
    }
  });
  var file_default = FilePlugin;
  function convertFormData(instance) {
    const items = [];
    instance.forEach((value, key) => {
      items.push([key, value]);
    });
    return items;
  }
  var FORM_DATA_FACTORY = {};
  var FORM_DATA_FACTORY_CONSTRUCTOR = (e, f = new FormData(), i = 0, s = e.length, t) => {
    for (; i < s; i++) {
      t = e[i];
      f.append(t[0], t[1]);
    }
    return f;
  };
  var FormDataFactoryPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/FormDataFactory",
    test(value) {
      return value === FORM_DATA_FACTORY;
    },
    parse: {
      sync() {
        return FORM_DATA_FACTORY;
      },
      async async() {
        return await Promise.resolve(FORM_DATA_FACTORY);
      },
      stream() {
        return FORM_DATA_FACTORY;
      }
    },
    serialize() {
      return FORM_DATA_FACTORY_CONSTRUCTOR.toString();
    },
    deserialize() {
      return FORM_DATA_FACTORY;
    }
  });
  var FormDataPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/FormData",
    extends: [file_default, FormDataFactoryPlugin],
    test(value) {
      if (typeof FormData === "undefined") {
        return false;
      }
      return value instanceof FormData;
    },
    parse: {
      sync(value, ctx) {
        return {
          factory: ctx.parse(FORM_DATA_FACTORY),
          entries: ctx.parse(convertFormData(value))
        };
      },
      async async(value, ctx) {
        return {
          factory: await ctx.parse(FORM_DATA_FACTORY),
          entries: await ctx.parse(convertFormData(value))
        };
      },
      stream(value, ctx) {
        return {
          factory: ctx.parse(FORM_DATA_FACTORY),
          entries: ctx.parse(convertFormData(value))
        };
      }
    },
    serialize(node, ctx) {
      return "(" + ctx.serialize(node.factory) + ")(" + ctx.serialize(node.entries) + ")";
    },
    deserialize(node, ctx) {
      return FORM_DATA_FACTORY_CONSTRUCTOR(
        ctx.deserialize(node.entries)
      );
    }
  });
  var form_data_default = FormDataPlugin;
  function convertHeaders(instance) {
    const items = [];
    instance.forEach((value, key) => {
      items.push([key, value]);
    });
    return items;
  }
  var HeadersPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/Headers",
    test(value) {
      if (typeof Headers === "undefined") {
        return false;
      }
      return value instanceof Headers;
    },
    parse: {
      sync(value, ctx) {
        return {
          value: ctx.parse(convertHeaders(value))
        };
      },
      async async(value, ctx) {
        return {
          value: await ctx.parse(convertHeaders(value))
        };
      },
      stream(value, ctx) {
        return {
          value: ctx.parse(convertHeaders(value))
        };
      }
    },
    serialize(node, ctx) {
      return "new Headers(" + ctx.serialize(node.value) + ")";
    },
    deserialize(node, ctx) {
      return new Headers(ctx.deserialize(node.value));
    }
  });
  var headers_default = HeadersPlugin;
  var READABLE_STREAM_FACTORY = {};
  var READABLE_STREAM_FACTORY_CONSTRUCTOR = (stream) => new ReadableStream({
    start: (controller) => {
      stream.on({
        next: (value) => {
          try {
            controller.enqueue(value);
          } catch (_error) {
          }
        },
        throw: (value) => {
          controller.error(value);
        },
        return: () => {
          try {
            controller.close();
          } catch (_error) {
          }
        }
      });
    }
  });
  var ReadableStreamFactoryPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/ReadableStreamFactory",
    test(value) {
      return value === READABLE_STREAM_FACTORY;
    },
    parse: {
      sync() {
        return READABLE_STREAM_FACTORY;
      },
      async async() {
        return await Promise.resolve(READABLE_STREAM_FACTORY);
      },
      stream() {
        return READABLE_STREAM_FACTORY;
      }
    },
    serialize() {
      return READABLE_STREAM_FACTORY_CONSTRUCTOR.toString();
    },
    deserialize() {
      return READABLE_STREAM_FACTORY;
    }
  });
  function toStream(value) {
    const stream = createStream();
    const reader = value.getReader();
    async function push() {
      try {
        const result = await reader.read();
        if (result.done) {
          stream.return(result.value);
        } else {
          stream.next(result.value);
          await push();
        }
      } catch (error) {
        stream.throw(error);
      }
    }
    push().catch(() => {
    });
    return stream;
  }
  var ReadableStreamPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval/plugins/web/ReadableStream",
    extends: [ReadableStreamFactoryPlugin],
    test(value) {
      if (typeof ReadableStream === "undefined") {
        return false;
      }
      return value instanceof ReadableStream;
    },
    parse: {
      sync(_value, ctx) {
        return {
          factory: ctx.parse(READABLE_STREAM_FACTORY),
          stream: ctx.parse(createStream())
        };
      },
      async async(value, ctx) {
        return {
          factory: await ctx.parse(READABLE_STREAM_FACTORY),
          stream: await ctx.parse(toStream(value))
        };
      },
      stream(value, ctx) {
        return {
          factory: ctx.parse(READABLE_STREAM_FACTORY),
          stream: ctx.parse(toStream(value))
        };
      }
    },
    serialize(node, ctx) {
      return "(" + ctx.serialize(node.factory) + ")(" + ctx.serialize(node.stream) + ")";
    },
    deserialize(node, ctx) {
      const stream = ctx.deserialize(node.stream);
      return READABLE_STREAM_FACTORY_CONSTRUCTOR(stream);
    }
  });
  var readable_stream_default = ReadableStreamPlugin;
  function createRequestOptions(current, body) {
    return {
      body,
      cache: current.cache,
      credentials: current.credentials,
      headers: current.headers,
      integrity: current.integrity,
      keepalive: current.keepalive,
      method: current.method,
      mode: current.mode,
      redirect: current.redirect,
      referrer: current.referrer,
      referrerPolicy: current.referrerPolicy
    };
  }
  var RequestPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/Request",
    extends: [readable_stream_default, headers_default],
    test(value) {
      if (typeof Request === "undefined") {
        return false;
      }
      return value instanceof Request;
    },
    parse: {
      async async(value, ctx) {
        return {
          url: await ctx.parse(value.url),
          options: await ctx.parse(
            createRequestOptions(
              value,
              value.body && !value.bodyUsed ? await value.clone().arrayBuffer() : null
            )
          )
        };
      },
      stream(value, ctx) {
        return {
          url: ctx.parse(value.url),
          options: ctx.parse(
            createRequestOptions(
              value,
              value.body && !value.bodyUsed ? value.clone().body : null
            )
          )
        };
      }
    },
    serialize(node, ctx) {
      return "new Request(" + ctx.serialize(node.url) + "," + ctx.serialize(node.options) + ")";
    },
    deserialize(node, ctx) {
      return new Request(
        ctx.deserialize(node.url),
        ctx.deserialize(node.options)
      );
    }
  });
  var request_default = RequestPlugin;
  function createResponseOptions(current) {
    return {
      headers: current.headers,
      status: current.status,
      statusText: current.statusText
    };
  }
  var ResponsePlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/Response",
    extends: [readable_stream_default, headers_default],
    test(value) {
      if (typeof Response === "undefined") {
        return false;
      }
      return value instanceof Response;
    },
    parse: {
      async async(value, ctx) {
        return {
          body: await ctx.parse(
            value.body && !value.bodyUsed ? await value.clone().arrayBuffer() : null
          ),
          options: await ctx.parse(createResponseOptions(value))
        };
      },
      stream(value, ctx) {
        return {
          body: ctx.parse(
            value.body && !value.bodyUsed ? value.clone().body : null
          ),
          options: ctx.parse(createResponseOptions(value))
        };
      }
    },
    serialize(node, ctx) {
      return "new Response(" + ctx.serialize(node.body) + "," + ctx.serialize(node.options) + ")";
    },
    deserialize(node, ctx) {
      return new Response(
        ctx.deserialize(node.body),
        ctx.deserialize(node.options)
      );
    }
  });
  var response_default = ResponsePlugin;
  var URLPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/URL",
    test(value) {
      if (typeof URL === "undefined") {
        return false;
      }
      return value instanceof URL;
    },
    parse: {
      sync(value, ctx) {
        return {
          value: ctx.parse(value.href)
        };
      },
      async async(value, ctx) {
        return {
          value: await ctx.parse(value.href)
        };
      },
      stream(value, ctx) {
        return {
          value: ctx.parse(value.href)
        };
      }
    },
    serialize(node, ctx) {
      return "new URL(" + ctx.serialize(node.value) + ")";
    },
    deserialize(node, ctx) {
      return new URL(ctx.deserialize(node.value));
    }
  });
  var url_default = URLPlugin;
  var URLSearchParamsPlugin = /* @__PURE__ */ createPlugin({
    tag: "seroval-plugins/web/URLSearchParams",
    test(value) {
      if (typeof URLSearchParams === "undefined") {
        return false;
      }
      return value instanceof URLSearchParams;
    },
    parse: {
      sync(value, ctx) {
        return {
          value: ctx.parse(value.toString())
        };
      },
      async async(value, ctx) {
        return {
          value: await ctx.parse(value.toString())
        };
      },
      stream(value, ctx) {
        return {
          value: ctx.parse(value.toString())
        };
      }
    },
    serialize(node, ctx) {
      return "new URLSearchParams(" + ctx.serialize(node.value) + ")";
    },
    deserialize(node, ctx) {
      return new URLSearchParams(ctx.deserialize(node.value));
    }
  });
  var url_search_params_default = URLSearchParamsPlugin;

  // node_modules/.pnpm/solid-js@1.9.13/node_modules/solid-js/web/dist/server.js
  var booleans = [
    "allowfullscreen",
    "async",
    "alpha",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "disabled",
    "formnovalidate",
    "hidden",
    "indeterminate",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "seamless",
    "selected",
    "adauctionheaders",
    "browsingtopics",
    "credentialless",
    "defaultchecked",
    "defaultmuted",
    "defaultselected",
    "defer",
    "disablepictureinpicture",
    "disableremoteplayback",
    "preservespitch",
    "shadowrootclonable",
    "shadowrootcustomelementregistry",
    "shadowrootdelegatesfocus",
    "shadowrootserializable",
    "sharedstoragewritable"
  ];
  var Properties = /* @__PURE__ */ new Set([
    "className",
    "value",
    "readOnly",
    "noValidate",
    "formNoValidate",
    "isMap",
    "noModule",
    "playsInline",
    "adAuctionHeaders",
    "allowFullscreen",
    "browsingTopics",
    "defaultChecked",
    "defaultMuted",
    "defaultSelected",
    "disablePictureInPicture",
    "disableRemotePlayback",
    "preservesPitch",
    "shadowRootClonable",
    "shadowRootCustomElementRegistry",
    "shadowRootDelegatesFocus",
    "shadowRootSerializable",
    "sharedStorageWritable",
    ...booleans
  ]);
  var ES2017FLAG = Feature.AggregateError | Feature.BigIntTypedArray;
  var GLOBAL_IDENTIFIER = "_$HY.r";
  function createSerializer({
    onData,
    onDone: onDone2,
    scopeId,
    onError: onError2,
    plugins: customPlugins
  }) {
    const defaultPlugins = [
      abort_signal_default,
      custom_event_default,
      dom_exception_default,
      event_default,
      form_data_default,
      headers_default,
      readable_stream_default,
      request_default,
      response_default,
      url_search_params_default,
      url_default
    ];
    const allPlugins = customPlugins ? [...customPlugins, ...defaultPlugins] : defaultPlugins;
    return new Serializer({
      scopeId,
      plugins: allPlugins,
      globalIdentifier: GLOBAL_IDENTIFIER,
      disabledFeatures: ES2017FLAG,
      onData,
      onDone: onDone2,
      onError: onError2
    });
  }
  function getLocalHeaderScript(id) {
    return getCrossReferenceHeader(id) + ";";
  }
  function renderToString(code, options = {}) {
    const {
      renderId
    } = options;
    let scripts = "";
    const serializer = createSerializer({
      scopeId: renderId,
      plugins: options.plugins,
      onData(script) {
        if (!scripts) {
          scripts = getLocalHeaderScript(renderId);
        }
        scripts += script + ";";
      },
      onError: options.onError
    });
    sharedConfig.context = {
      id: renderId || "",
      count: 0,
      suspense: {},
      lazy: {},
      assets: [],
      nonce: options.nonce,
      serialize(id, p) {
        !sharedConfig.context.noHydrate && serializer.write(id, p);
      },
      roots: 0,
      nextRoot() {
        return this.renderId + "i-" + this.roots++;
      }
    };
    let html = createRoot((d) => {
      setTimeout(d);
      return resolveSSRNode(escape(code()));
    });
    sharedConfig.context.noHydrate = true;
    serializer.close();
    html = injectAssets(sharedConfig.context.assets, html);
    if (scripts.length) html = injectScripts(html, scripts, options.nonce);
    return html;
  }
  function ssr(t, ...nodes) {
    if (nodes.length) {
      let result = "";
      for (let i = 0; i < nodes.length; i++) {
        result += t[i];
        const node = nodes[i];
        if (node !== void 0) result += resolveSSRNode(node);
      }
      t = result + t[nodes.length];
    }
    return {
      t
    };
  }
  function ssrHydrationKey() {
    const hk = getHydrationKey();
    return hk ? ` data-hk="${hk}"` : "";
  }
  function escape(s, attr) {
    const t = typeof s;
    if (t !== "string") {
      if (!attr && t === "function") return escape(s());
      if (!attr && Array.isArray(s)) {
        s = s.slice();
        for (let i = 0; i < s.length; i++) s[i] = escape(s[i]);
        return s;
      }
      if (attr && t === "boolean") return String(s);
      return s;
    }
    const delim = attr ? '"' : "<";
    const escDelim = attr ? "&quot;" : "&lt;";
    let iDelim = s.indexOf(delim);
    let iAmp = s.indexOf("&");
    if (iDelim < 0 && iAmp < 0) return s;
    let left = 0, out = "";
    while (iDelim >= 0 && iAmp >= 0) {
      if (iDelim < iAmp) {
        if (left < iDelim) out += s.substring(left, iDelim);
        out += escDelim;
        left = iDelim + 1;
        iDelim = s.indexOf(delim, left);
      } else {
        if (left < iAmp) out += s.substring(left, iAmp);
        out += "&amp;";
        left = iAmp + 1;
        iAmp = s.indexOf("&", left);
      }
    }
    if (iDelim >= 0) {
      do {
        if (left < iDelim) out += s.substring(left, iDelim);
        out += escDelim;
        left = iDelim + 1;
        iDelim = s.indexOf(delim, left);
      } while (iDelim >= 0);
    } else while (iAmp >= 0) {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
    return left < s.length ? out + s.substring(left) : out;
  }
  function resolveSSRNode(node, top) {
    const t = typeof node;
    if (t === "string") return node;
    if (node == null || t === "boolean") return "";
    if (Array.isArray(node)) {
      let prev = {};
      let mapped = "";
      for (let i = 0, len = node.length; i < len; i++) {
        if (!top && typeof prev !== "object" && typeof node[i] !== "object") mapped += `<!--!$-->`;
        mapped += resolveSSRNode(prev = node[i]);
      }
      return mapped;
    }
    if (t === "object") return node.t;
    if (t === "function") return resolveSSRNode(node());
    return String(node);
  }
  function getHydrationKey() {
    const hydrate = sharedConfig.context;
    return hydrate && !hydrate.noHydrate && sharedConfig.getNextContextId();
  }
  function injectAssets(assets, html) {
    if (!assets || !assets.length) return html;
    let out = "";
    for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
    const index = html.indexOf("</head>");
    if (index === -1) return html;
    return html.slice(0, index) + out + html.slice(index);
  }
  function injectScripts(html, scripts, nonce) {
    const tag = `<script${nonce ? ` nonce="${nonce}"` : ""}>${scripts}</script>`;
    const index = html.indexOf("<!--xs-->");
    if (index > -1) {
      return html.slice(0, index) + tag + html.slice(index);
    }
    return html + tag;
  }
  function notSup() {
    throw new Error("Client-only API called on the server side. Run client-only code in onMount, or conditionally run client-only component with <Show>.");
  }

  // web/runtime.jsx
  var isServer = true;
  function definePage(Component, options = {}) {
    if (isServer) {
      globalThis.render = (props) => renderToString(() => createComponent(Component, props));
      if (options.meta && typeof options.meta !== "function") {
        throw new Error("meta must be a function returning an object");
      }
      globalThis.meta = options.meta;
    } else {
      const root = document.getElementById("app");
      if (!root) throw new Error("root not found");
      notSup(() => createComponent(Component, mergeProps(() => window.__DATA__)), root);
    }
    return Component;
  }

  // web/pages/Testy.jsx
  var _tmpl$ = ["<div", ">Test</div>"];
  var Test = (props) => {
    return ssr(_tmpl$, ssrHydrationKey());
  };
  var Testy_default = definePage(Test);
})();
