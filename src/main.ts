/**
 * Portfolio Website - Main TypeScript
 * Diyar Faraj - Senior Backend, DevOps & Cloud Engineer
 *
 * Terminal typing effect animation
 */

interface TypingSection {
  command: HTMLElement;
  text: string;
  output: HTMLElement;
  cursor: HTMLElement;
}

class TerminalTyping {
  private sections: TypingSection[] = [];
  private typeSpeed = 80;
  private delayBetweenSections = 400;

  constructor() {
    this.initSections();
  }

  private initSections(): void {
    const typingSections = document.querySelectorAll('.typing-section');

    typingSections.forEach((section) => {
      const typeText = section.querySelector('.type-text') as HTMLElement;
      const output = section.querySelector('.typing-output') as HTMLElement;
      const cursor = section.querySelector('.cursor') as HTMLElement;

      if (typeText && output && cursor) {
        const text = typeText.dataset.text || '';

        // Hide output initially
        output.style.opacity = '0';
        output.style.visibility = 'hidden';

        this.sections.push({
          command: typeText,
          text: text,
          output: output,
          cursor: cursor
        });
      }
    });
  }

  private typeText(section: TypingSection): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;

      const type = () => {
        if (index < section.text.length) {
          section.command.textContent = section.text.substring(0, index + 1);
          index++;
          setTimeout(type, this.typeSpeed + Math.random() * 30);
        } else {
          resolve();
        }
      };

      type();
    });
  }

  private showOutput(section: TypingSection): Promise<void> {
    return new Promise((resolve) => {
      section.output.style.visibility = 'visible';
      section.output.style.opacity = '1';
      section.output.style.transition = 'opacity 0.3s ease';

      // Hide cursor after typing
      section.cursor.style.display = 'none';

      setTimeout(resolve, this.delayBetweenSections);
    });
  }

  public async start(): Promise<void> {
    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      await this.typeText(section);
      await this.showOutput(section);

      // Show final blinking cursor on last section
      if (i === this.sections.length - 1) {
        const finalCursor = section.command.parentElement?.querySelector('.cursor-final') as HTMLElement;
        if (finalCursor) {
          finalCursor.style.display = 'inline';
        }
      }
    }
  }
}

// Certificate Modal
class CertModal {
  private modal: HTMLElement;
  private modalImage: HTMLImageElement;
  private backdrop: HTMLElement;
  private closeBtn: HTMLElement;

  constructor() {
    this.modal = document.getElementById('certModal') as HTMLElement;
    this.modalImage = document.getElementById('certModalImage') as HTMLImageElement;
    this.backdrop = this.modal.querySelector('.cert-modal-backdrop') as HTMLElement;
    this.closeBtn = this.modal.querySelector('.cert-modal-close') as HTMLElement;

    this.initEvents();
  }

  private initEvents(): void {
    // Click on [view] to open modal
    const viewButtons = document.querySelectorAll('.cert-view');
    viewButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const certItem = btn.closest('.cert-item') as HTMLElement;
        const img = certItem?.querySelector('img') as HTMLImageElement;
        if (img) {
          this.open(img.src, img.alt);
        }
      });
    });

    // Click on [visit] to go to URL
    const visitButtons = document.querySelectorAll('.cert-visit');
    visitButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const certItem = btn.closest('.cert-item') as HTMLElement;
        const url = certItem?.dataset.url;
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      });
    });

    // Close modal
    this.backdrop.addEventListener('click', () => this.close());
    this.closeBtn.addEventListener('click', () => this.close());

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }

  private open(src: string, alt: string): void {
    this.modalImage.src = src;
    this.modalImage.alt = alt;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  private close(): void {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay before starting the typing effect
  setTimeout(() => {
    const terminal = new TerminalTyping();
    terminal.start();
  }, 500);

  // Initialize certificate modal
  new CertModal();
});
