import { GeneratedProject, GeneratedProjectSchema } from "./gemini";

type UnknownFile = string | { code?: unknown };

function extractJsonObject(text: string): string {
  const source = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();
  const start = source.indexOf("{");
  if (start < 0) throw new Error("No JSON object found in Gemini response");

  let depth = 0;
  let quoted = false;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') quoted = false;
      continue;
    }
    if (character === '"') quoted = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  throw new Error("Gemini response contains incomplete JSON");
}

function normalisePath(path: string): string {
  const fileName = path.replace(/^\/?(?:src\/)?/, "");
  if (/^app\.(?:jsx?|tsx?)$/i.test(fileName)) return "/App.js";
  if (/^styles?\.(?:css)$/i.test(fileName)) return "/styles.css";
  return path.startsWith("/") ? path : `/${path}`;
}

function normaliseFiles(value: unknown): Record<string, { code: string }> {
  const source = (value && typeof value === "object" && "files" in value)
    ? (value as { files: unknown }).files
    : value;
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new Error("Gemini response does not contain a files object");
  }

  const files: Record<string, { code: string }> = {};
  for (const [path, file] of Object.entries(source as Record<string, UnknownFile>)) {
    const code = typeof file === "string" ? file : file?.code;
    if (typeof code === "string" && code.trim()) files[normalisePath(path)] = { code };
  }
  return files;
}

export function parseGeminiResponse(responseText: string): GeneratedProject {
  const parsed = JSON.parse(extractJsonObject(responseText)) as unknown;
  const files = normaliseFiles(parsed);

  if (!files["/App.js"]) throw new Error("Gemini response does not include App.js");
  files["/styles.css"] ??= { code: "" };

  return GeneratedProjectSchema.parse({ files });
}

export function validateGeneratedProject(project: GeneratedProject): boolean {
  return Boolean(project.files["/App.js"]?.code.trim());
}
