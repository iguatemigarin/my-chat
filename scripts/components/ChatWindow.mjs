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
                    height: 100%;
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
                messageList.addMessage('This is a simulated response from the LLM.', 'llm');
            }, 1000);
        });
    }
}

customElements.define('chat-window', ChatWindow);