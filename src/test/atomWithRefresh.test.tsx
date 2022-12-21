import { atom, useAtom } from "jotai";
import { startTransition, Suspense, useState } from "react";
import { act, create } from "react-test-renderer";

const countAtom = atom(0);

const timeout = (t: number) => new Promise((r) => setTimeout(r, t));

let count = 0;

const Counter = () => {
  return <></>;
};
