import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

class ContextBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  setContent(content) {
    this.shadowRoot.querySelector('slot').innerHTML = marked(content);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 10px;
          font-size: 14px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          overflow-y: scroll;
        }
        pre {
          white-space: break-spaces;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define('context-box', ContextBox);
