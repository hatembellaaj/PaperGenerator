import { Router } from 'express';
import { openai, assertEnv } from '../openaiClient.js';
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

    // Option A: Assistants API using a stateless prompt (preferred). Replace ASSISTANT_ID with your real ID.
    const prompt = `You are helping write a scientific paper about LLMs.\n` +
      `Paper title: ${paperTitle}\n` +
      `Section: ${sectionLabel} (${sectionId})\n` +
      `Mode: ${mode}\n` +
      `Current section content: ${sectionContent || '[empty]'}\n` +
      `Other sections (summary): ${otherSectionsSummary || 'N/A'}\n` +
      `Return only the updated text for this section.`;

    // Using chat completions for simplicity. Swap to client.responses.create with Assistants API if desired.
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini', // Replace with your preferred model
      messages: [
        {
          role: 'system',
          content:
            'You assist with drafting sections of a scientific paper about LLMs. Keep responses focused on the requested section.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: mode === 'summarize' ? 0.2 : 0.5,
    });

    const content = completion.choices[0]?.message?.content || 'No content generated.';

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
