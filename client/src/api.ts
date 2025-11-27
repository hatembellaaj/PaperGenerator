import axios from 'axios';
import { PaperSection, SectionId } from './types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

export async function callAssistantForSection(params: {
  sectionId: SectionId;
  sectionContent: string;
  paperTitle: string;
  allSections: PaperSection[];
  mode: 'draft' | 'improve' | 'summarize';
}): Promise<{ content: string }> {
  const response = await apiClient.post('/assist-section', params);
  return response.data.assistantMessage;
}
