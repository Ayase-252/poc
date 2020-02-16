import React from "react";

export function MicroApplication({ appId, main, host }) {
  const containerId = `${appId}-container`;
  React.useEffect(() => {
    const scriptId = `${appId}-script`;
    if (document.getElementById(scriptId)) {
      mountApp();
      return unmountApp;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `${host}/${main}`;
    script.onload = mountApp;
    document.head.append(script);

    return unmountApp;
  }, []);

  const mountApp = React.useCallback(() => {
    if (typeof window[`mount${appId}`] !== "function") {
      console.error(
        `mount${appId} is not a function, are you forget to write one?`
      );
      return;
    }
    window[`mount${appId}`] && window[`mount${appId}`](containerId);
  }, []);

  const unmountApp = React.useCallback(() => {
    if (typeof window[`unmount${appId}`] !== "function") {
      console.error(
        `unmount${appId} is not a function, are you forget to write one?`
      );
      return;
    }
    window[`unmount${appId}`] && window[`unmount${appId}`](containerId);
  }, []);

  return <main id={containerId}></main>;
}
