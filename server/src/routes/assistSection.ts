import { Router } from 'express';
import { openai, assistantId, assertEnv } from '../openaiClient.js';
import { AssistRequestBody, AssistResponse } from '../types.js';

const router = Router();

router.post('/assist-section', async (req, res) => {
  const body = req.body as AssistRequestBody;
  const { sectionId, sectionContent, paperTitle, allSections, mode } = body;

  if (!sectionId || !paperTitle || !mode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    assertEnv();
    const sectionLabel = allSections.find((s) => s.id === sectionId)?.label || sectionId;
    const otherSectionsSummary = allSections
      .filter((s) => s.id !== sectionId && s.content)
      .map((s) => `${s.label}: ${s.content.substring(0, 200)}...`)
      .join('\n');

    const prompt = `You are helping write a scientific paper about LLMs.\n` +
      `Paper title: ${paperTitle}\n` +
      `Section: ${sectionLabel} (${sectionId})\n` +
      `Mode: ${mode}\n` +
      `Current section content: ${sectionContent || '[empty]'}\n` +
      `Other sections (summary): ${otherSectionsSummary || 'N/A'}\n` +
      `Return only the updated text for this section.`;

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistantId!,
      temperature: mode === 'summarize' ? 0.2 : 0.5,
    });

    if (run.status !== 'completed') {
      throw new Error(`Assistant run did not complete (status: ${run.status}).`);
    }

    const messages = await openai.beta.threads.messages.list(thread.id, { order: 'desc', limit: 1 });
    const message = messages.data[0];
    const textContent = message?.content.find((item) => item.type === 'text');
    const content = textContent?.type === 'text' ? textContent.text.value : 'No content generated.';

    const response: AssistResponse = {
      assistantMessage: { content },
    };

    return res.json(response);
  } catch (error) {
    console.error('Assistant error', error);
    return res.status(500).json({ error: 'Failed to contact assistant.' });
  }
});

export default router;
