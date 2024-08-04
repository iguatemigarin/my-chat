class ChatWindow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 600px;
          height: 80vh;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      </style>
      <message-list></message-list>
      <message-input></message-input>
    `;
  }

  setupEventListeners() {
    const messageInput = this.shadowRoot.querySelector('message-input');
    messageInput.addEventListener('message-sent', async (e) => {
      const messageList = this.shadowRoot.querySelector('message-list');
      const userMessage = e.detail.message;
      messageList.addMessage(userMessage, 'user');

      // Send the message to Ollama and wait for a response
      try {
        const response = await window.chatWithOllama(userMessage);
        messageList.addMessage(response, 'llm');
      } catch (error) {
        console.error('Error getting response from Ollama:', error);
        messageList.addMessage(
          'Sorry, there was an error communicating with the LLM.',
          'llm'
        );
      }
    });
  }
}

customElements.define('chat-window', ChatWindow);
