import { Demo } from "@microdemo/schema";

// Extend Window interface to include our custom property
declare global {
  interface Window {
    __MICRODEMO_STUDIO__?: string;
  }
}

// Allow runtime override of the Studio URL
const STUDIO_BASE = window.__MICRODEMO_STUDIO__ ?? "http://localhost:3002";

class MicrodemoPlayer extends HTMLElement {
  private demoId: string | null = null;
  private demo: Demo | null = null;
  private loading: boolean = false;
  private error: string | null = null;
  private shadow: ShadowRoot;
  private abortController: AbortController | null = null;

  static get observedAttributes() {
    return ['data-id'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.abortController = new AbortController();
  }

  connectedCallback() {
    this.demoId = this.getAttribute('data-id');
    this.loadDemo();
  }

  disconnectedCallback() {
    // Cleanup
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === 'data-id' && newValue) {
      this.demoId = newValue;
      this.loadDemo();
    }
  }

  private async loadDemo() {
    // Abort any pending requests
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    if (!this.demoId) {
      this.error = 'Missing data-id attribute';
      this.render();
      return;
    }

    this.loading = true;
    this.error = null;
    this.render();

    try {
      const response = await fetch(`${STUDIO_BASE}/api/public/${this.demoId}`, {
        signal: this.abortController.signal,
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load demo: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.ok || !data.demo) {
        throw new Error(data.error || 'Invalid demo data');
      }
      
      this.demo = data.demo;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load demo';
    } finally {
      this.loading = false;
      this.render();
    }
  }

  private render() {
    if (!this.shadow) return;

    // Create styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        font-family: system-ui, sans-serif;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1.25rem;
        max-width: 100%;
        background: white;
        color: #111827;
        --md-teal: #14b8a6;
        --md-fuchsia: #d946ef;
        --md-mahogany: #7b3f2a;
      }
      
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 2rem;
        color: #4b5563;
      }
      
      .spinner {
        width: 1rem;
        height: 1rem;
        border: 2px solid #e5e7eb;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .error {
        padding: 1.5rem;
        text-align: center;
        color: #dc3545;
        border: 1px solid #fecaca;
        border-radius: 0.375rem;
        background-color: #fef2f2;
      }
      
      .error-title {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
      }
      
      .header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
      }
      
      .demo-id {
        margin-left: auto;
        font-size: 0.75rem;
        color: #6b7280;
        background: #f9fafb;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
      }
      
      .steps {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0;
        margin: 0;
        list-style: none;
      }
      
      .step {
        display: flex;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: #f8f9fa;
        border-left: 3px solid var(--md-teal);
        border-radius: 0.25rem;
      }
      
      .step-number {
        color: var(--md-teal);
        font-weight: 600;
      }
      
      .step-content {
        flex: 1;
      }
      
      .step-caption {
        margin: 0 0 0.25rem 0;
        font-size: 0.9375rem;
        line-height: 1.5;
        color: #111827;
      }
      
      .step-details {
        margin: 0;
        font-size: 0.8125rem;
        color: #6b7280;
      }
      
      .footer {
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
        font-size: 0.75rem;
        color: #6b7280;
        text-align: center;
      }
    `;

    // Clear existing content
    while (this.shadow.firstChild) this.shadow.removeChild(this.shadow.firstChild);
    this.shadow.appendChild(style);

    // Create container
    const container = document.createElement('div');
    container.className = 'container';

    if (this.loading) {
      const loading = document.createElement('div');
      loading.className = 'loading';
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      const span = document.createElement('span');
      span.textContent = 'Loading demo...';
      loading.appendChild(spinner);
      loading.appendChild(span);
      this.shadow.appendChild(loading);
      return;
    }

    if (this.error) {
      const error = document.createElement('div');
      error.className = 'error';
      const title = document.createElement('h4');
      title.className = 'error-title';
      title.textContent = 'Error loading demo';
      const msg = document.createElement('p');
      msg.className = 'error-message';
      msg.textContent = this.error;
      error.appendChild(title);
      error.appendChild(msg);
      this.shadow.appendChild(error);
      return;
    }

    if (!this.demo) {
      const empty = document.createElement('div');
      empty.className = 'error';
      empty.textContent = 'No demo data available';
      this.shadow.appendChild(empty);
      return;
    }

    // Create header
    const header = document.createElement('div');
    header.className = 'header';
    
    const title = document.createElement('h3');
    title.className = 'title';
    title.textContent = this.demo.title || 'Untitled Demo';
    
    header.appendChild(title);
    
    if (this.demo.publicId) {
      const demoId = document.createElement('span');
      demoId.className = 'demo-id';
      demoId.textContent = this.demo.publicId;
      header.appendChild(demoId);
    }
    
    container.appendChild(header);

    // Create steps list
    const stepsList = document.createElement('ul');
    stepsList.className = 'steps';

    if (this.demo.steps.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No steps recorded in this demo.';
      container.appendChild(emptyMessage);
    } else {
      this.demo.steps.forEach((step, index) => {
        const stepEl = document.createElement('li');
        stepEl.className = 'step';
        
        const stepNumber = document.createElement('span');
        stepNumber.className = 'step-number';
        stepNumber.textContent = `${index + 1}.`;
        
        const stepContent = document.createElement('div');
        stepContent.className = 'step-content';
        
        const caption = document.createElement('p');
        caption.className = 'step-caption';
        caption.textContent = step.caption || `${step.action} ${step.selector || ''}`.trim();
        
        const details = document.createElement('p');
        details.className = 'step-details';
        details.textContent = `Action: ${step.action}${step.selector ? ` on ${step.selector}` : ''}`;
        
        stepContent.appendChild(caption);
        stepContent.appendChild(details);
        
        stepEl.appendChild(stepNumber);
        stepEl.appendChild(stepContent);
        stepsList.appendChild(stepEl);
      });
      
      container.appendChild(stepsList);
    }

    // Add footer
    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.textContent = 'Interactive demo player - Powered by Microdemo';
    container.appendChild(footer);

    this.shadow.appendChild(container);
  }
}

customElements.define("microdemo-player", MicrodemoPlayer);
