"use client";

import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  Upload,
  Sparkles,
  Code2,
  Eye,
  Zap,
  CheckCircle2,
  ArrowRight,
  FileCode,
  Layers,
  Wand2,
  Sliders,
  X,
  Cpu,
  Laptop,
  Check,
  FileImage,
  RefreshCw,
} from "lucide-react";
import { DownloadButton } from "@/components/dashboard/DownloadButton";
import { SandboxPreview } from "@/components/dashboard/SandboxPreview";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import type { GeneratedProject } from "@/types/generated-project";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const PROMPT_SUGGESTIONS = [
  "Make it fully mobile-responsive",
  "Use a modern dark theme",
  "Add smooth hover animations",
  "Add a sticky navigation bar",
];

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

  const appendSuggestion = (suggestion: string) => {
    setInstructions((prev) => {
      if (!prev) return suggestion;
      if (prev.includes(suggestion)) return prev;
      return `${prev}. ${suggestion}`;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050508] text-slate-100 bg-grid-pattern selection:bg-purple-500/30 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#050508]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-purple-700 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform group-hover:scale-105">
              <span className="font-extrabold text-white text-lg tracking-wider">M</span>
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">MrUI</span>
                <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                  AI v2.4
                </span>
              </div>
            </div>
          </a>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Engine Online
            </div>
            <button
              onClick={() => uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-200 transition hover:border-purple-400 hover:bg-purple-500/20 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            >
              Start creating
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="relative isolate px-5 pb-20 pt-16 text-center sm:px-8 md:pb-28 md:pt-24">
          <div className="hero-glow" aria-hidden="true" />

          {/* Floating UI Elements (Desktop Decorative) */}
          <div className="hidden xl:block pointer-events-none">
            <div className="absolute left-8 top-32 w-64 glass-card p-4 text-left animate-float opacity-85 shadow-2xl border-purple-500/20">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-300 mb-2 border-b border-white/10 pb-2">
                <Code2 className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>GeneratedComponent.jsx</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 leading-relaxed overflow-hidden">
                <code>
                  <span className="text-fuchsia-400">export default</span> <span className="text-purple-300">function</span> <span className="text-blue-300">App</span>() &#123;<br/>
                  &nbsp;&nbsp;<span className="text-fuchsia-400">return</span> (<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-emerald-400">div</span> <span className="text-purple-300">className</span>=<span className="text-amber-300">&quot;flex bg-slate-900&quot;</span>&gt;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-emerald-400">Hero</span> <span className="text-purple-300">title</span>=<span className="text-amber-300">&quot;MrUI AI&quot;</span> /&gt;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-emerald-400">div</span>&gt;<br/>
                  &nbsp;&nbsp;)<br/>
                  &#125;
                </code>
              </pre>
            </div>

            <div className="absolute right-8 top-40 w-60 glass-card p-4 text-left animate-float-reverse opacity-85 shadow-2xl border-purple-500/20">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2 border-b border-white/10 pb-2">
                <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" /> Vision Parser
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">99.4% Match</span>
              </div>
              <div className="space-y-2 text-[11px] text-slate-400">
                <div className="flex justify-between"><span>Layout:</span> <span className="text-slate-200 font-mono">Flex Matrix</span></div>
                <div className="flex justify-between"><span>Components:</span> <span className="text-slate-200 font-mono">14 Detected</span></div>
                <div className="flex justify-between"><span>Tailwind:</span> <span className="text-emerald-400 font-mono">v4 Synthesized</span></div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Top Pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-400 animate-pulse" />
              <span className="tracking-wide uppercase text-[11px]">AI Design-to-Code Converter</span>
            </div>

            {/* Impactful Headline */}
            <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl">
              Turn screenshots into <br className="hidden sm:inline" />
              <span className="text-gradient">stunning React code.</span>
            </h1>

            {/* Product-focused Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
              Upload any UI mockup or screenshot. Our AI vision engine analyzes layout structure, components, and typography—instantly generating editable React code with a live preview sandbox.
            </p>

            {/* Transformation Pipeline Diagram */}
            <div className="mt-10 mx-auto max-w-3xl glass-card p-4 sm:p-5 border-white/10 shadow-2xl">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-center gap-2">
                <span>AI Conversion Pipeline</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/40 transition">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2">
                    <FileImage className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">1. Screenshot</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">PNG / JPG / WebP</span>
                </div>

                <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/40 transition relative">
                  <div className="w-9 h-9 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300 mb-2">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">2. AI Vision</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Layout Parsing</span>
                </div>

                <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/40 transition">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-300 mb-2">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">3. React Code</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Tailwind v4</span>
                </div>

                <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/40 transition">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-2">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">4. Live Website</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Interactive Preview</span>
                </div>
              </div>
            </div>

            {/* Key Feature Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-300 shadow-sm backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                AI Design Analysis
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-300 shadow-sm backdrop-blur-sm">
                <Code2 className="w-3.5 h-3.5 text-fuchsia-400" />
                React Generation
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-300 shadow-sm backdrop-blur-sm">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                Live Preview
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-300 shadow-sm backdrop-blur-sm">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                Editable Code
              </span>
            </div>

            {/* CTA Hero Button */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                size="lg"
                className="w-full sm:w-auto px-8 py-3.5 text-base shine-effect shadow-[0_0_35px_rgba(168,85,247,0.4)]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create from a screenshot
              </Button>
            </div>
          </div>
        </section>

        {/* Upload Section / Premium AI Workspace Panel */}
        <section ref={uploadSectionRef} className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8" aria-label="Upload design">
          {!project ? (
            <div className="glass-panel glass-panel-hover relative overflow-hidden p-6 sm:p-10">
              <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />
              <div className="pointer-events-none absolute -left-28 -bottom-28 h-72 w-72 rounded-full bg-fuchsia-600/15 blur-3xl" />

              <div className="relative">
                {/* AI Workspace Studio Header Bar */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-widest text-purple-400">AI Studio Panel</span>
                    </div>
                    <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl tracking-tight">Upload design screenshot</h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1">PNG</span>
                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1">JPG</span>
                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1">WEBP</span>
                    <span className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-purple-300">Max 10MB</span>
                  </div>
                </div>

                {/* Dropzone Container with Feedback States */}
                <div
                  {...getRootProps()}
                  className={`upload-zone group cursor-pointer ${isDragActive ? "upload-zone-active" : ""}`}
                >
                  <input {...getInputProps()} />

                  {isGenerating ? (
                    /* Processing State */
                    <div className="relative py-8 px-4 flex flex-col items-center justify-center">
                      {/* Scanning beam effect over preview image if exists */}
                      {previewUrl && (
                        <div className="relative mb-6 max-h-56 overflow-hidden rounded-xl border border-purple-500/40 shadow-2xl">
                          <img src={previewUrl} alt="Processing design" className="max-h-56 object-contain opacity-60 filter blur-[1px]" />
                          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent shadow-[0_0_15px_#d946ef] animate-scanline" />
                        </div>
                      )}
                      
                      <div className="relative flex h-16 w-16 items-center justify-center mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
                        <Loader size="lg" />
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1">Synthesizing React Website...</h3>
                      <p className="text-xs text-purple-300 font-mono mb-4 animate-pulse">Running AI Layout & Component Analysis</p>
                      
                      <div className="flex flex-col gap-1.5 text-xs text-slate-400 max-w-sm text-center font-mono">
                        <span className="text-emerald-400 flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Screenshot parsed successfully
                        </span>
                        <span className="text-purple-300 flex items-center justify-center gap-1">
                          <Loader size="sm" /> Generating React JSX & Tailwind v4 styles...
                        </span>
                      </div>
                    </div>
                  ) : previewUrl ? (
                    /* Uploaded Image Preview State */
                    <div className="relative py-2 px-4 flex flex-col items-center">
                      <div className="group/preview relative max-h-64 rounded-xl border border-purple-500/30 bg-slate-950/60 p-2 shadow-2xl transition hover:border-purple-400">
                        <img
                          src={previewUrl}
                          alt="Uploaded design preview"
                          className="mx-auto max-h-56 rounded-lg object-contain shadow-inner"
                        />
                        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 px-2 text-xs">
                          <span className="font-mono text-purple-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Image Ready
                          </span>
                          <span className="text-slate-400 font-mono">
                            {screenshot ? formatFileSize(screenshot.size) : ""}
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-slate-400">Click or drag a new image to replace</p>
                    </div>
                  ) : (
                    /* Default Drag & Drop State */
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="upload-icon-wrapper mb-4">
                        {isDragActive ? (
                          <Sparkles className="w-8 h-8 text-fuchsia-300 animate-bounce" />
                        ) : (
                          <Upload className="w-8 h-8 text-purple-300" />
                        )}
                      </div>

                      <p className="text-base font-bold text-white sm:text-lg">
                        {isDragActive ? "Drop screenshot to analyze..." : "Drop your screenshot here"}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        or <span className="text-purple-400 font-medium underline underline-offset-4">click to browse</span> from your computer
                      </p>

                      <div className="mt-5 flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-white/[0.02] border border-white/5 px-4 py-1.5 rounded-full">
                        <span>Auto-Layout Detection</span>
                        <span>•</span>
                        <span>React + Tailwind v4</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Uploaded File Action Strip */}
                {screenshot && !isGenerating && (
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3 text-sm">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileImage className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="font-medium text-white truncate">{screenshot.name}</span>
                      <span className="text-xs text-slate-400 font-mono">({formatFileSize(screenshot.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setScreenshot(null);
                        setPreviewUrl(null);
                      }}
                      className="ml-4 flex items-center gap-1 text-xs font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition"
                    >
                      <X className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                )}

                {/* Optional Instructions Box */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-white" htmlFor="instructions">
                      <Wand2 className="w-4 h-4 text-purple-400" />
                      Optional instructions
                    </label>
                    <span className="text-xs text-slate-400">Customize AI generation</span>
                  </div>

                  {/* Suggestion Pills */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {PROMPT_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => appendSuggestion(suggestion)}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300 transition hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>

                  <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(event) => setInstructions(event.target.value)}
                    placeholder="For example: Make the header sticky, use dark slate colors, and add smooth hover states for all buttons."
                    className="input min-h-28 w-full resize-y text-sm leading-relaxed"
                  />
                </div>

                {/* Main Generate Button */}
                <Button
                  onClick={generate}
                  disabled={!screenshot || isGenerating}
                  size="lg"
                  className="mt-8 w-full py-4 text-base font-bold shine-effect shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                >
                  {isGenerating ? (
                    <>
                      <Loader size="sm" className="mr-2" /> Generating your website...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2 text-amber-300" /> Generate website from screenshot
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* Workspace Panel for Generated Site */
            <section id="workspace" className="glass-panel p-5 sm:p-8">
              <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Generated Project Ready</p>
                  </div>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">Edit & Preview Your Site</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <DownloadButton files={project.files} />
                  <Button variant="outline" onClick={reset} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> New screenshot
                  </Button>
                </div>
              </div>

              <SandboxPreview files={project.files} onUpdate={(files) => setProject({ files })} />
            </section>
          )}
        </section>

        {/* Feature Showcase Grid Section */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-4xl">Engineered for modern web workflows</h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Everything you need to turn static visual designs into clean, production-ready React components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Design Analysis</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Multimodal vision models analyze your screenshot to extract spatial layout structure, typography, and color tokens.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center text-xs font-mono text-purple-300">
                <span>Layout & Vision API</span>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-4">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">React Generation</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Produces modular JSX structure formatted with Tailwind CSS utilities—ready to copy or download.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center text-xs font-mono text-fuchsia-300">
                <span>Tailwind v4 Powered</span>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Live Preview</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Instant real-time rendering sandbox allows you to interact with the generated site directly on the page.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center text-xs font-mono text-blue-300">
                <span>Sandpack Sandbox</span>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <FileCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Editable Code</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Full access to inspect and modify React code with instant hot-reloading and one-click ZIP project export.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center text-xs font-mono text-emerald-300">
                <span>One-Click Export</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050508]/90 px-5 py-10 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-fuchsia-500 font-bold text-white text-xs">
              M
            </div>
            <span className="font-bold text-white text-sm">MrUI</span>
            <span className="text-slate-400">• Screenshot to React Code</span>
          </div>
          <p>© 2026 MrUI · Premium AI Developer Tools</p>
        </div>
      </footer>
    </div>
  );
}
