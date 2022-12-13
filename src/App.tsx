import { createElement, Suspense } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Broadcast } from "./pages/Broadcast";
import { Cache } from "./pages/Cache";
import { Listener } from "./pages/Listener";
import { Loop } from "./pages/Loop";
import { Promisable } from "./pages/Promise";
import { Refresh } from "./pages/Refresh";
import { Test } from "./pages/Test";
import { UseSetAtomAsync } from "./pages/UseSetAtomAsync";
import { Wait } from "./pages/Wait";

const RouteComponents = [
  Refresh,
  Loop,
  Cache,
  Wait,
  Listener,
  Broadcast,
  Promisable,
  UseSetAtomAsync,
  Test,
];

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          display: "flex",
          gap: 10,
          width: "100%",
        }}
      >
        <div
          style={{
            flex: "0 0 300px",
            fontSize: 20,
          }}
        >
          {RouteComponents.map((component, index) => {
            return (
              <div
                key={index}
                style={{
                  margin: "5px 0",
                }}
              >
                <Link
                  to={{
                    pathname: component.name,
                  }}
                >
                  {component.name}
                </Link>
              </div>
            );
          })}
        </div>
        <div
          style={{
            flex: "1 1 auto",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            alignItems: "flex-start",
          }}
        >
          <Suspense fallback="page is suspense ing">
            <Routes>
              {RouteComponents.map((component) => (
                <Route
                  key={component.name}
                  path={component.name}
                  element={createElement(component)}
                />
              ))}
            </Routes>
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
