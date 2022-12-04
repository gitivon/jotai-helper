import { Suspense } from "react";
import { Count } from "./atoms";
import { ReloadBtn } from "./Refresh";

const Inner = () => {
  return <></>;
};

export const Wait = () => {
  return (
    <>
      <Suspense fallback="waiting...">
        <Inner />
      </Suspense>
      <Count />
      <ReloadBtn />
    </>
  );
};
