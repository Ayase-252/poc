import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MicroApplication } from "..";

function renderMicroApplication() {
  return render(
    <MicroApplication
      appId="microapp"
      main="main.js"
      host="http://localhost"
    ></MicroApplication>
  );
}

describe("MicroApplication", () => {
  beforeEach(() => {
    window.mountmicroapp = () => {};
    window.unmountmicroapp = () => {};
  });
  afterEach(() => {
    document.head.innerHTML = "";
  });
  it("should create a container for micro application", () => {
    const { container } = renderMicroApplication();

    expect(container.querySelector("#microapp-container")).toBeInTheDocument();
  });

  it("should load entry script after rendering", () => {
    renderMicroApplication();
    expect(document.getElementById("microapp-script")).toBeInTheDocument();
    expect(document.getElementById("microapp-script")).toHaveAttribute(
      "src",
      "http://localhost/main.js"
    );

    const mountMicroApp = jest.fn();
    window.mountmicroapp = mountMicroApp;
    fireEvent.load(document.getElementById("microapp-script"));
    expect(mountMicroApp).toBeCalledWith("microapp-container");
  });

  it("should not reload loaded script", () => {
    const appScript = document.createElement("script");
    appScript.id = "microapp-script";
    document.head.appendChild(appScript);

    const mountMicroApp = jest.fn();
    window.mountmicroapp = mountMicroApp;
    renderMicroApplication();
    expect(document.getElementById("microapp-script")).toEqual(appScript);
    expect(mountMicroApp).toBeCalledWith("microapp-container");
  });

  it("should execute umount handle when application is offload", () => {
    const unmountMicroApp = jest.fn();
    window.unmountmicroapp = unmountMicroApp;

    const { unmount } = renderMicroApplication();
    unmount();
    expect(unmountMicroApp).toBeCalledWith("microapp-container");
  });
});
