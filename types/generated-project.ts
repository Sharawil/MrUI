export interface GeneratedFile {
  code: string;
}

export interface GeneratedProject {
  files: Record<string, GeneratedFile>;
}