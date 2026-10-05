import { ViewTransition } from "react";

/**
 * Every route mounts fresh through this template. The View Transition API
 * crossfades the old page out and settles the new one in (see the
 * ::view-transition rules in globals.css); browsers without support swap
 * instantly. Shared product photographs morph between pages by name.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div className="flex flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
