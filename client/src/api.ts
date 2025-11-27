import axios from 'axios';
import { PaperSection, SectionId } from './types';

export async function callAssistantForSection(params: {
  sectionId: SectionId;
  sectionContent: string;
  paperTitle: string;
  allSections: PaperSection[];
  mode: 'draft' | 'improve' | 'summarize';
}): Promise<{ content: string }> {
  const response = await axios.post('/api/assist-section', params);
  return response.data.assistantMessage;
}
