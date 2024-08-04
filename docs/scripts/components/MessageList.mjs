class MessageList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.messageElements = new Map();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          overflow-y: auto;
          flex-grow: 1;
          padding: 20px;
        }
        .message {
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 5px;
        }
        .user {
          background-color: #e1f5fe;
          align-self: flex-end;
        }
        .llm {
          background-color: #f0f0f0;
          align-self: flex-start;
        }
      </style>
      <div id="message-container"></div>
    `;
  }

  addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = text;
    this.shadowRoot
      .querySelector('#message-container')
      .appendChild(messageElement);

    const messageId = Date.now().toString();
    this.messageElements.set(messageId, messageElement);

    this.scrollToBottom();
    return messageId;
  }

  updateMessage(messageId, text, sender) {
    const messageElement = this.messageElements.get(messageId);
    if (messageElement) {
      messageElement.innerHTML = text;
      messageElement.className = `message ${sender}`;
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    this.shadowRoot.querySelector('#message-container').scrollTop =
      this.shadowRoot.querySelector('#message-container').scrollHeight;
  }
}

customElements.define('message-list', MessageList);
