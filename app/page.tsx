"use client";

import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { DownloadButton } from "@/components/dashboard/DownloadButton";
import { SandboxPreview } from "@/components/dashboard/SandboxPreview";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import type { GeneratedProject } from "@/types/generated-project";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function HomePage() {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [instructions, setInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const uploadSectionRef = useRef<HTMLElement>(null);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const setUploadedFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. The maximum size is 10MB.");
      return;
    }
    setScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    maxFiles: 1,
    multiple: false,
    onDrop: ([file]) => file && setUploadedFile(file),
    onDropRejected: () => toast.error("Upload one PNG, JPG, or WebP image up to 10MB."),
  });

  const generate = async () => {
    if (!screenshot) {
      toast.error("Upload a design screenshot first.");
      return;
    }

    setIsGenerating(true);
    try {
      const body = new FormData();
      body.append("screenshot", screenshot);
      body.append("instructions", instructions.trim());
      const response = await fetch("/api/generate", { method: "POST", body });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Generation failed.");
      setProject(data);
      toast.success("Your website is ready to preview.");
      requestAnimationFrame(() => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setProject(null);
    setScreenshot(null);
    setPreviewUrl(null);
    setInstructions("");
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07070b]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3 font-bold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[var(--purple-main)] to-[var(--purple-bright)] shadow-[0_0_24px_rgba(168,85,247,.45)]">M</span>
            <span className="text-xl tracking-tight">MrUI</span>
          </a>
          <button onClick={() => uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" })} className="rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:border-[var(--purple-main)] hover:text-white">Start creating</button>
        </div>
      </header>

      <main id="top">
        <section className="relative isolate px-5 pb-16 pt-20 text-center sm:px-8 md:pb-24 md:pt-28">
          <div className="hero-glow" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl">
            <p className="mb-6 inline-flex rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[.18em] text-fuchsia-300">AI design to code</p>
            <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">Turn screenshots into <span className="text-gradient">stunning websites.</span></h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-[var(--text-secondary)] sm:text-lg">Upload a design, add your direction, and get editable React code with a live preview—without starting from a blank page.</p>
            <Button onClick={() => uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" })} size="lg" className="mt-8 px-7">Create from a screenshot</Button>
          </div>
        </section>

        <section ref={uploadSectionRef} className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8" aria-label="Upload design">
          {!project ? (
            <div className="glass-panel relative overflow-hidden p-5 sm:p-8">
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
              <div className="relative">
                <div className="mb-7 text-center">
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">Upload your design</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">PNG, JPG, or WebP · maximum 10MB</p>
                </div>
                <div {...getRootProps()} className={`upload-zone ${isDragActive ? "upload-zone-active" : ""}`}>
                  <input {...getInputProps()} />
                  {previewUrl ? <img src={previewUrl} alt="Uploaded design preview" className="mx-auto max-h-64 rounded-xl border border-white/10 object-contain shadow-2xl" /> : <><span className="upload-icon" aria-hidden="true">↑</span><p className="mt-4 font-semibold text-white">Drop your screenshot here</p><p className="mt-1 text-sm text-[var(--text-secondary)]">or click to browse your computer</p></>}
                </div>
                {screenshot && <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[.03] px-4 py-3 text-sm"><span className="truncate text-[var(--text-secondary)]">{screenshot.name}</span><button type="button" onClick={() => { setScreenshot(null); setPreviewUrl(null); }} className="ml-4 text-fuchsia-300 hover:text-fuchsia-200">Remove</button></div>}
                <label className="mt-6 block text-sm font-medium text-white" htmlFor="instructions">Optional instructions</label>
                <textarea id="instructions" value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="For example: make the design mobile-friendly and add subtle hover effects." className="input mt-2 min-h-28 w-full resize-y" />
                <Button onClick={generate} disabled={!screenshot || isGenerating} size="lg" className="mt-6 w-full py-4 text-base">
                  {isGenerating ? <><Loader size="sm" className="border-white" /> Generating your website…</> : "Generate website"}
                </Button>
              </div>
            </div>
          ) : (
            <section id="workspace" className="glass-panel p-4 sm:p-6">
              <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-fuchsia-300">Generated project</p><h2 className="mt-1 text-2xl font-bold text-white">Edit and preview your site</h2></div>
                <div className="flex flex-wrap gap-2"><DownloadButton files={project.files} /><Button variant="outline" onClick={reset}>New screenshot</Button></div>
              </div>
              <SandboxPreview files={project.files} onUpdate={(files) => setProject({ files })} />
            </section>
          )}
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-[var(--text-secondary)]">© 2026 MrUI · Design to code with AI</footer>
    </div>
  );
}
