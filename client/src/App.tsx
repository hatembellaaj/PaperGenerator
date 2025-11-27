import React, { useEffect, useMemo, useState } from 'react';
import { callAssistantForSection } from './api';
import TabBar from './components/TabBar';
import SectionEditor from './components/SectionEditor';
import { AssistantMessage, PaperSection, PaperState, SectionId } from './types';

const SECTION_DEFINITIONS: { id: SectionId; label: string }[] = [
  { id: 'abstract', label: 'Abstract' },
  { id: 'introduction', label: 'Introduction' },
  { id: 'related_work', label: 'Related Work' },
  { id: 'method', label: 'Method' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'results_discussion', label: 'Results & Discussion' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'conclusion', label: 'Conclusion' },
];

const createEmptyPaperState = (): PaperState => ({
  title: 'Untitled LLM Paper',
  sections: SECTION_DEFINITIONS.map((def) => ({ ...def, content: '' })),
});

const LOCAL_STORAGE_KEY = 'paper-assistant-state';

function App() {
  const [paperState, setPaperState] = useState<PaperState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as PaperState;
      } catch (e) {
        console.warn('Failed to parse saved state', e);
      }
    }
    return createEmptyPaperState();
  });
  const [activeSectionId, setActiveSectionId] = useState<SectionId>('abstract');
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([]);
  const [loadingSection, setLoadingSection] = useState<SectionId | null>(null);
  const [errorBySection, setErrorBySection] = useState<Record<SectionId, string | undefined>>({
    abstract: undefined,
    introduction: undefined,
    related_work: undefined,
    method: undefined,
    experiments: undefined,
    results_discussion: undefined,
    limitations: undefined,
    conclusion: undefined,
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(paperState));
  }, [paperState]);

  const currentSection = useMemo(
    () => paperState.sections.find((s) => s.id === activeSectionId)!,
    [paperState.sections, activeSectionId]
  );

  const updateSectionContent = (id: SectionId, content: string) => {
    setPaperState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === id ? { ...section, content } : section
      ),
    }));
  };

  const handleAssistantRequest = async (mode: 'draft' | 'improve' | 'summarize') => {
    setLoadingSection(currentSection.id);
    setErrorBySection((prev) => ({ ...prev, [currentSection.id]: undefined }));
    try {
      const result = await callAssistantForSection({
        sectionId: currentSection.id,
        sectionContent: currentSection.content,
        paperTitle: paperState.title,
        allSections: paperState.sections,
        mode,
      });
      const newMessage: AssistantMessage = {
        id: `${currentSection.id}-${Date.now()}`,
        sectionId: currentSection.id,
        role: 'assistant',
        content: result.content,
        createdAt: new Date().toISOString(),
      };
      setAssistantMessages((prev) => [...prev.slice(-4), newMessage]);
    } catch (err) {
      console.error(err);
      setErrorBySection((prev) => ({
        ...prev,
        [currentSection.id]: 'Failed to contact assistant. Please try again.',
      }));
    } finally {
      setLoadingSection(null);
    }
  };

  const insertText = (text: string) => {
    updateSectionContent(currentSection.id, `${currentSection.content}\n\n${text}`.trim());
  };

  const replaceText = (text: string) => {
    updateSectionContent(currentSection.id, text);
  };

  const exportMarkdown = () => {
    const markdownLines = [
      `# ${paperState.title}`,
      '',
      ...paperState.sections.flatMap((section) => [
        `## ${section.label}`,
        section.content || '_No content yet._',
        '',
      ]),
    ];
    const blob = new Blob([markdownLines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'paper-draft.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetPaper = () => {
    if (confirm('Start a new paper? This will clear all sections.')) {
      setPaperState(createEmptyPaperState());
      setAssistantMessages([]);
    }
  };

  const messagesForSection = assistantMessages.filter((m) => m.sectionId === currentSection.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-2xl font-bold text-gray-900">LLM Paper Assistant</h1>
            <input
              type="text"
              value={paperState.title}
              onChange={(e) => setPaperState((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full min-w-[240px] rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
              placeholder="Paper title"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportMarkdown}
              className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-gray-900"
            >
              Export as Markdown
            </button>
            <button
              onClick={resetPaper}
              className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow hover:bg-red-50"
            >
              New paper / Reset
            </button>
          </div>
        </div>
        <TabBar
          sections={paperState.sections}
          activeId={activeSectionId}
          onSelect={setActiveSectionId}
        />
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <SectionEditor
          section={currentSection}
          onContentChange={(value) => updateSectionContent(currentSection.id, value)}
          onAsk={handleAssistantRequest}
          assistantMessages={messagesForSection}
          onInsert={insertText}
          onReplace={replaceText}
          loading={loadingSection === currentSection.id}
          error={errorBySection[currentSection.id]}
        />
      </main>
    </div>
  );
}

export default App;
