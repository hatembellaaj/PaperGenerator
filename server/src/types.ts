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

export type AssistRequestBody = {
  sectionId: SectionId;
  sectionContent: string;
  paperTitle: string;
  allSections: PaperSection[];
  mode: 'draft' | 'improve' | 'summarize';
};

export type AssistResponse = {
  assistantMessage: {
    content: string;
  };
};
