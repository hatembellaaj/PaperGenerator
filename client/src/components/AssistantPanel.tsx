import React from 'react';
import { AssistantMessage } from '../types';

type AssistantPanelProps = {
  messages: AssistantMessage[];
  onInsert: (content: string) => void;
  onReplace: (content: string) => void;
  loading: boolean;
  error?: string;
};

const AssistantPanel: React.FC<AssistantPanelProps> = ({
  messages,
  onInsert,
  onReplace,
  loading,
  error,
}) => {
  return (
    <div className="mt-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Assistant responses</h3>
        {loading && <span className="text-xs text-blue-600">Assistant is thinking…</span>}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {messages.length === 0 && !loading && !error && (
        <p className="text-sm text-gray-500">No suggestions yet. Ask the assistant to get started.</p>
      )}
      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Assistant suggestion</span>
              <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-800">{msg.content}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onInsert(msg.content)}
                className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-green-700"
              >
                Insert
              </button>
              <button
                onClick={() => onReplace(msg.content)}
                className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-blue-700"
              >
                Replace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssistantPanel;
