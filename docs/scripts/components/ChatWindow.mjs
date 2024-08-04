import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { chatWithOllama } from '../ollamaChat.mjs';

class ChatWindow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentLLMMessageId = null;
    this.state = {
      context: [],
      summary: '',
    };
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
      <context-box></context-box>
      <message-list></message-list>
      <message-input></message-input>
    `;
  }

  setupEventListeners() {
    const messageInput = this.shadowRoot.querySelector('message-input');
    messageInput.addEventListener(
      'message-sent',
      this.handleMessageSent.bind(this)
    );

    // Listen for partial response events
    document.addEventListener(
      'partialResponse',
      this.handlePartialResponse.bind(this)
    );
  }

  async handleMessageSent(e) {
    const messageList = this.shadowRoot.querySelector('message-list');
    const userMessage = e.detail.message;
    messageList.addMessage(userMessage, 'user');

    // Initialize LLM response
    this.currentLLMMessageId = messageList.addMessage('...', 'llm');

    try {
      const newState = await chatWithOllama({
        prompt: userMessage,
        context: this.state.context,
      });
      this.updateState(newState);
      // The full response will be updated through partial response events
    } catch (error) {
      console.error('Error getting response from Ollama:', error);
      messageList.updateMessage(
        this.currentLLMMessageId,
        'Sorry, there was an error communicating with the LLM.',
        'llm'
      );
    }
  }

  handlePartialResponse(e) {
    const messageList = this.shadowRoot.querySelector('message-list');
    const partialResponse = e.detail;

    if (this.currentLLMMessageId) {
      messageList.updateMessage(
        this.currentLLMMessageId,
        this.formatResponse(partialResponse),
        'llm'
      );
    }
  }

  formatResponse(response) {
    return marked(response);
  }

  updateState(newState) {
    this.state = newState;
    this.updateSummary();
  }

  updateSummary() {
    const { summary } = this.state;
    const contextBox = this.shadowRoot.querySelector('context-box');
    contextBox.setContent(summary);
  }
}

customElements.define('chat-window', ChatWindow);
