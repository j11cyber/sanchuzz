/** Every route mounts fresh through this template, so the enter animation plays on each navigation. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter flex flex-1 flex-col">{children}</div>;
}
