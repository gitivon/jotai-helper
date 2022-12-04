import { ComponentType, createElement, ReactNode, Suspense } from "react";

export const withSuspense = <P,>(
  component: ComponentType<P>,
  fallback: ReactNode = "page suspend ..."
) => {
  return (props: P) => {
    return (
      <Suspense fallback={fallback}>{createElement(component, props)}</Suspense>
    );
  };
};
