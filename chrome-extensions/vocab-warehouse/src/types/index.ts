export interface VocabDataForm {
  word: string;
  attribute: string;
  definition: string;
  examples: string[];
}

export interface VocabPayload extends VocabDataForm {
  createdAt: string;
  updatedAt: string;
}

export interface ChromeRuntimeMsg {
  key: string;
  data: Record<string, any> | null;
}
