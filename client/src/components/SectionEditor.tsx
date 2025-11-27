import React from 'react';
import { AssistantMessage, PaperSection } from '../types';
import AssistantPanel from './AssistantPanel';

type SectionEditorProps = {
  section: PaperSection;
  onContentChange: (value: string) => void;
  onAsk: (mode: 'draft' | 'improve' | 'summarize') => void;
  assistantMessages: AssistantMessage[];
  onInsert: (text: string) => void;
  onReplace: (text: string) => void;
  loading: boolean;
  error?: string;
};

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onContentChange,
  onAsk,
  assistantMessages,
  onInsert,
  onReplace,
  loading,
  error,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold text-gray-800" htmlFor={section.id}>
          {section.label}
        </label>
        <textarea
          id={section.id}
          value={section.content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[240px] w-full resize-none rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-900 shadow-inner focus:border-blue-500 focus:outline-none"
          placeholder={`Write the ${section.label} here...`}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onAsk('draft')}
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          Ask assistant to draft section
        </button>
        <button
          onClick={() => onAsk('improve')}
          disabled={loading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          Improve current text
        </button>
        <button
          onClick={() => onAsk('summarize')}
          disabled={loading}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          Summarize section
        </button>
      </div>

      <AssistantPanel
        messages={assistantMessages}
        onInsert={onInsert}
        onReplace={onReplace}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default SectionEditor;
