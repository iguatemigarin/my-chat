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
    messageInput.addEventListener('message-sent', (e) => {
      const messageList = this.shadowRoot.querySelector('message-list');
      messageList.addMessage(e.detail.message, 'user');
      // Here you would typically send the message to the LLM and wait for a response
      // For now, we'll just simulate a response after a short delay
      setTimeout(() => {
        messageList.addMessage(
          'This is a simulated response from the LLM.',
          'llm',
        );
      }, 1000);
    });
  }
}

customElements.define('chat-window', ChatWindow);
