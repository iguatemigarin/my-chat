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

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim() === '') continue;
        const parsedLine = JSON.parse(line);
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
      prompt: `<user>${prompt}</user><assistant>${fullResponse}</assistant>`,
      system:
        'You are a helpful assistant. Your only job is to generate a context of the conversation. Generate this context based on the user input and your response. Keep the important points of the conversation.',
      stream: false,
      context,
    });

    return (await newContextResponse.json()).response;
  } catch (error) {
    console.error('Error chatting with Ollama:', error);
    return 'Sorry, there was an error communicating with Ollama.';
  }
}

function generate({ prompt, system, stream = true, options = {} }) {
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
    }),
  });
}
