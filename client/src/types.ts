export type SectionId =
  | 'abstract'
  | 'introduction'
  | 'related_work'
  | 'method'
  | 'experiments'
  | 'results_discussion'
  | 'limitations'
  | 'conclusion';

export type PaperSection = {
  id: SectionId;
  label: string;
  content: string;
};

export type PaperState = {
  title: string;
  sections: PaperSection[];
};

export type AssistantMessage = {
  id: string;
  sectionId: SectionId;
  role: 'assistant';
  content: string;
  createdAt: string;
};
