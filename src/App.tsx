import { Suspense } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Broadcast } from "./pages/Broadcast";
import { Cache } from "./pages/Cache";
import { Listener } from "./pages/Listener";
import { Loop } from "./pages/Loop";
import { Promisable } from "./pages/Promise";
import { Refresh } from "./pages/Refresh";
import { UseSetAtomAsync } from "./pages/UseSetAtomAsync";
import { Wait } from "./pages/Wait";

const routes = [
  {
    path: "/refresh",
    element: <Refresh />,
  },
  {
    path: "/loop",
    element: <Loop />,
  },
  {
    path: "/cache",
    element: <Cache />,
  },
  {
    path: "/wait",
    element: <Wait />,
  },
  {
    path: '/listener',
    element: <Listener />,
  },
  {
    path: '/broadcast',
    element: <Broadcast />,
  },
  {
    path: '/promise',
    element: <Promisable />,
  },
  {
    path: "/use-set-atom-async",
    element: <UseSetAtomAsync />,
  },
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
          {routes.map((route) => {
            return (
              <div
                key={route.path}
                style={{
                  margin: "5px 0",
                }}
              >
                <Link
                  to={{
                    pathname: route.path,
                  }}
                >
                  {route.path}
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
              {routes.map((route) => (
                <Route {...route} key={route.path} />
              ))}
            </Routes>
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
