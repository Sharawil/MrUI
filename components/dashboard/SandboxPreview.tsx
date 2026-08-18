"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";

interface SandboxPreviewProps {
  files: Record<string, { code: string }>;
  onUpdate: (files: Record<string, { code: string }>) => void;
}

function FileSynchronizer({ onUpdate }: Pick<SandboxPreviewProps, "onUpdate">) {
  const { sandpack } = useSandpack();
  const lastValue = useRef("");

  useEffect(() => {
    const files = Object.fromEntries(
      Object.entries(sandpack.files)
        .filter(([path]) => path === "/App.js" || path === "/styles.css")
        .map(([path, file]) => [path, { code: file.code }])
    );
    const nextValue = JSON.stringify(files);

    if (nextValue !== lastValue.current) {
      lastValue.current = nextValue;
      onUpdate(files);
    }
  }, [onUpdate, sandpack.files]);

  return null;
}

export function SandboxPreview({ files, onUpdate }: SandboxPreviewProps) {
  const sandpackFiles = useMemo(
    () => ({
      "/App.js": files["/App.js"]?.code ?? "export default function App() { return <main />; }",
      "/styles.css": files["/styles.css"]?.code ?? "",
    }),
    [files]
  );

  return (
    <SandpackProvider
      template="react"
      files={sandpackFiles}
      theme="dark"
      options={{
        activeFile: "/App.js",
        visibleFiles: ["/App.js", "/styles.css"],
        externalResources: ["https://cdn.tailwindcss.com"],
      }}
    >
      <FileSynchronizer onUpdate={onUpdate} />
      <SandpackLayout className="!overflow-hidden !rounded-xl !border-[var(--border-color)] !bg-[var(--bg-secondary)]">
        <SandpackCodeEditor showTabs showLineNumbers wrapContent style={{ height: 560 }} />
        <SandpackPreview showOpenInCodeSandbox={false} showRefreshButton style={{ height: 560 }} />
      </SandpackLayout>
    </SandpackProvider>
  );
}
