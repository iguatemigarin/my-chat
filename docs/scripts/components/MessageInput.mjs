class MessageInput extends HTMLElement {
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
          display: block;
          padding: 20px;
          border-top: 1px solid #e0e0e0;
        }
        form {
          display: flex;
        }
        input {
          flex-grow: 1;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          margin-left: 10px;
          cursor: pointer;
        }
      </style>
      <form>
        <input type="text" placeholder="Type your message...">
        <button type="submit">Send</button>
      </form>
    `;
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector('form');
    const input = this.shadowRoot.querySelector('input');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (message) {
        this.dispatchEvent(
          new CustomEvent('message-sent', {
            detail: { message },
            bubbles: true,
            composed: true,
          })
        );
        input.value = '';
      }
    });
  }
}

customElements.define('message-input', MessageInput);
