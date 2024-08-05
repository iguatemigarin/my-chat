const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

export async function chatWithOllama({ prompt, context }) {
  try {
    const response = await generate({
      prompt,
      system:
        'You are an assistant. Your job is to chat with the user and provide concise and helpful responses.',
      context,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let latestLine;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim() === '') continue;
        const parsedLine = JSON.parse(line);
        latestLine = parsedLine;
        if (parsedLine.response) {
          fullResponse += parsedLine.response;
          // Emit an event with the partial response
          document.dispatchEvent(
            new CustomEvent('partialResponse', { detail: fullResponse })
          );
        }
      }
    }

    const newContextResponse = await generate({
      prompt: 'Generate the context of our conversation.',
      system: `
Your only job is to generate a context of the conversation.
Ensure the context is up-to-date with all the messages.
`,
      stream: false,
      context: latestLine.context,
    });

    return {
      summary: (await newContextResponse.json()).response,
      context: latestLine.context,
    };
  } catch (error) {
    console.error('Error chatting with Ollama:', error);
    return 'Sorry, there was an error communicating with Ollama.';
  }
}

function generate({
  prompt,
  system,
  stream = true,
  options = {},
  context = [],
  format,
}) {
  return fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.1:latest',
      prompt,
      stream,
      system,
      options,
      context,
      format,
    }),
  });
}
