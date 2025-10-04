(() => {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        display: contents;
      }
      .backdrop {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 1.5rem;
        box-sizing: border-box;
        background: rgba(15, 23, 42, 0.35);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.25s ease, visibility 0.25s ease;
        z-index: 1000;
      }
      .backdrop[data-state="open"] {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }
      .modal {
        position: relative;
        width: min(100%, 32rem);
        border-radius: 1.25rem;
        background: #ffffff;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
        padding: clamp(1.8rem, 4vw, 2.6rem);
        box-sizing: border-box;
        transform: translateY(16px);
        transition: transform 0.25s ease;
        outline: none;
      }
      .backdrop[data-state="open"] .modal {
        transform: translateY(0);
      }
      .close-button {
        position: absolute;
        top: 1.1rem;
        right: 1.1rem;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        border: none;
        background: rgba(99, 102, 241, 0.1);
        color: #4f46e5;
        font-size: 1.35rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      .close-button:hover {
        background: rgba(99, 102, 241, 0.18);
        transform: scale(1.03);
      }
      .header {
        margin-bottom: 1.2rem;
      }
      .header ::slotted(*) {
        margin: 0;
        font-size: clamp(1.5rem, 3.2vw, 1.9rem);
        font-weight: 700;
        letter-spacing: -0.01em;
        color: #1d1d1f;
      }
      .body {
        display: grid;
        gap: 0.9rem;
        color: #3c3f52;
        font-size: 1rem;
      }
      ::slotted(ul.price-list) {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.75rem;
      }
      ::slotted(ul.price-list li) {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        font-size: 1.02rem;
      }
      ::slotted(ul.price-list li span:last-child) {
        font-weight: 600;
        color: #111827;
      }
      ::slotted(.notice) {
        font-size: 0.92rem;
        color: #6b7280;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1.5rem;
      }
      ::slotted([slot="actions"]) {
        border-radius: 999px;
        padding: 0.75rem 1.4rem;
        border: none;
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        color: #ffffff;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      ::slotted([slot="actions"]:hover) {
        box-shadow: 0 16px 24px rgba(99, 102, 241, 0.25);
        transform: translateY(-2px);
      }
      .secondary {
        border-radius: 999px;
        padding: 0.72rem 1.35rem;
        border: 1px solid rgba(99, 102, 241, 0.3);
        background: #ffffff;
        color: #4f46e5;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
      }
      .secondary:hover {
        background: rgba(99, 102, 241, 0.08);
        transform: translateY(-1px);
      }
      @media (max-width: 560px) {
        .modal {
          border-radius: 1rem;
          padding: 1.6rem;
        }
        .actions {
          justify-content: stretch;
        }
        .actions ::slotted([slot="actions"]),
        .secondary {
          flex: 1 1 auto;
          text-align: center;
        }
      }
    </style>
    <div class="backdrop" data-state="closed" aria-hidden="true">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="price-modal-title" tabindex="-1">
        <button class="close-button" type="button" aria-label="닫기">&times;</button>
        <header class="header">
          <slot name="title">
            <h2 id="price-modal-title">가격 안내</h2>
          </slot>
        </header>
        <section class="body">
          <slot name="body">가격 정보를 추가해주세요.</slot>
        </section>
        <footer class="actions">
          <slot name="actions"></slot>
          <button class="secondary" type="button" data-close>닫기</button>
        </footer>
      </div>
    </div>
  `;

  class PriceModal extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.backdrop = this.shadowRoot.querySelector(".backdrop");
      this.modal = this.shadowRoot.querySelector(".modal");
      this.titleSlot = this.shadowRoot.querySelector('slot[name="title"]');

      this.handleCloseClick = this.close.bind(this);
      this.handleBackdropClick = this.handleBackdropClick.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);
      this.handleTitleSlotChange = this.handleTitleSlotChange.bind(this);
    }

    connectedCallback() {
      this.closeButtons = Array.from(this.shadowRoot.querySelectorAll("[data-close], .close-button"));
      this.closeButtons.forEach((button) => button.addEventListener("click", this.handleCloseClick));
      this.backdrop.addEventListener("click", this.handleBackdropClick);
      this.titleSlot.addEventListener("slotchange", this.handleTitleSlotChange);
      this.handleTitleSlotChange();
    }

    disconnectedCallback() {
      if (this.closeButtons) {
        this.closeButtons.forEach((button) => button.removeEventListener("click", this.handleCloseClick));
      }
      this.backdrop.removeEventListener("click", this.handleBackdropClick);
      this.titleSlot.removeEventListener("slotchange", this.handleTitleSlotChange);
      document.removeEventListener("keydown", this.handleKeydown);
    }

    open() {
      if (this.backdrop.dataset.state === "open") {
        return;
      }

      this.previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      this.backdrop.dataset.state = "open";
      this.backdrop.setAttribute("aria-hidden", "false");
      document.addEventListener("keydown", this.handleKeydown);

      requestAnimationFrame(() => {
        this.modal.focus();
      });

      this.dispatchEvent(new CustomEvent("price-modal:open", { bubbles: true, composed: true }));
    }

    close() {
      if (this.backdrop.dataset.state === "closed") {
        return;
      }

      this.backdrop.dataset.state = "closed";
      this.backdrop.setAttribute("aria-hidden", "true");
      document.removeEventListener("keydown", this.handleKeydown);

      if (this.previousActiveElement && typeof this.previousActiveElement.focus === "function") {
        this.previousActiveElement.focus();
        this.previousActiveElement = null;
      }

      this.dispatchEvent(new CustomEvent("price-modal:close", { bubbles: true, composed: true }));
    }

    handleBackdropClick(event) {
      if (event.target === this.backdrop) {
        this.close();
      }
    }

    handleKeydown(event) {
      if (this.backdrop.dataset.state !== "open") {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        this.close();
        return;
      }

      if (event.key === "Tab") {
        this.trapFocus(event);
      }
    }

    handleTitleSlotChange() {
      const assigned = this.titleSlot.assignedElements({ flatten: true });
      const labelledTarget = assigned.find((element) => element.id);
      if (labelledTarget) {
        this.modal.setAttribute("aria-labelledby", labelledTarget.id);
      } else {
        this.modal.setAttribute("aria-labelledby", "price-modal-title");
      }
    }

    trapFocus(event) {
      const focusableSelectors = [
        "button",
        "[href]",
        "input",
        "select",
        "textarea",
        '[tabindex]:not([tabindex="-1"])'
      ].join(",");

      const slotElements = Array.from(this.shadowRoot.querySelectorAll("slot"));
      const slotted = slotElements.flatMap((slot) => {
        return slot.assignedElements({ flatten: true }).flatMap((element) => {
          if (!(element instanceof HTMLElement)) {
            return [];
          }
          const matches = element.matches(focusableSelectors);
          const descendants = Array.from(element.querySelectorAll ? element.querySelectorAll(focusableSelectors) : []);
          return matches ? [element, ...descendants] : descendants;
        });
      });

      const shadowElements = Array.from(this.shadowRoot.querySelectorAll(focusableSelectors));
      const focusable = Array.from(new Set([...shadowElements, ...slotted])).filter((element) => {
        if (!(element instanceof HTMLElement)) {
          return false;
        }
        if (element.hasAttribute("disabled")) {
          return false;
        }
        const tabindex = element.getAttribute("tabindex");
        return tabindex === null || tabindex !== "-1";
      });

      if (focusable.length === 0) {
        event.preventDefault();
        this.modal.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  if (!customElements.get("price-modal")) {
    customElements.define("price-modal", PriceModal);
  }
})();
