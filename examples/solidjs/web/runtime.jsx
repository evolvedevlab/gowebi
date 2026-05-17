import { hydrate, renderToString } from "solid-js/web";

const isServer = __SERVER__;

export function definePage(Component, options = {}) {
  if (isServer) {
    globalThis.render = (props) => renderToString(() => <Component {...props} />);
    if (options.meta && typeof options.meta !== "function") {
      throw new Error("meta must be a function returning an object");
    }

    globalThis.meta = options.meta;
  } else {
    const root = document.getElementById("app");
    if (!root) throw new Error("root not found");
    hydrate(() => <Component {...window.__DATA__} />, root);
  }

  return Component;
}
