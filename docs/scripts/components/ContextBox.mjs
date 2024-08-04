class ContextBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 10px;
          margin: 10px;
          font-size: 14px;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define('context-box', ContextBox);

export default ContextBox;
