/**
 * Portfolio Website - Main TypeScript
 * Diyar Faraj - Senior Backend, DevOps & Cloud Engineer
 *
 * Terminal typing intro, interactive shell, cert modal, CRT extras.
 * Zero dependencies — pure vanilla TS.
 */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =====================================================
// Typing intro
// =====================================================

interface TypingSection {
  command: HTMLElement;
  text: string;
  output: HTMLElement;
  cursor: HTMLElement;
}

class TerminalTyping {
  private sections: TypingSection[] = [];
  private typeSpeed = 60;
  private delayBetweenSections = 250;
  private skipped = false;

  constructor(private onDone: () => void) {
    this.initSections();

    // Any click or keypress fast-forwards the intro
    const skip = () => { this.skipped = true; };
    document.addEventListener('pointerdown', skip, { once: true });
    document.addEventListener('keydown', skip, { once: true });
  }

  private initSections(): void {
    document.querySelectorAll('.typing-section').forEach((section) => {
      const typeText = section.querySelector<HTMLElement>('.type-text');
      const output = section.querySelector<HTMLElement>('.typing-output');
      const cursor = section.querySelector<HTMLElement>('.cursor');

      if (typeText && output && cursor) {
        this.sections.push({
          command: typeText,
          text: typeText.dataset.text || '',
          output,
          cursor,
        });
      }
    });
  }

  private typeText(section: TypingSection): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;

      const type = () => {
        if (this.skipped) {
          section.command.textContent = section.text;
          resolve();
          return;
        }
        if (index < section.text.length) {
          section.command.textContent = section.text.substring(0, index + 1);
          index++;
          setTimeout(type, this.typeSpeed + Math.random() * 40);
        } else {
          resolve();
        }
      };

      type();
    });
  }

  private showOutput(section: TypingSection): Promise<void> {
    return new Promise((resolve) => {
      section.output.style.transition = this.skipped ? 'none' : 'opacity 0.3s ease';
      section.output.style.visibility = 'visible';
      section.output.style.opacity = '1';
      section.cursor.style.display = 'none';
      setTimeout(resolve, this.skipped ? 0 : this.delayBetweenSections);
    });
  }

  private revealAllInstantly(): void {
    this.sections.forEach((section) => {
      section.command.textContent = section.text;
      section.output.style.transition = 'none';
      section.output.style.visibility = 'visible';
      section.output.style.opacity = '1';
      section.cursor.style.display = 'none';
    });
  }

  public async start(): Promise<void> {
    if (REDUCED_MOTION) {
      this.revealAllInstantly();
      this.onDone();
      return;
    }

    for (const section of this.sections) {
      await this.typeText(section);
      await this.showOutput(section);
    }
    this.onDone();
  }
}

// =====================================================
// Interactive shell
// =====================================================

interface ShellCommand {
  description: string;
  run: (args: string[]) => string | void;
}

class Shell {
  private input: HTMLInputElement;
  private output: HTMLElement;
  private section: HTMLElement;
  private history: string[] = [];
  private historyIndex = -1;
  private matrix: MatrixRain;

  private commands: Record<string, ShellCommand> = {
    help: {
      description: 'list available commands',
      run: () => {
        const rows = Object.entries(this.commands)
          .map(([name, cmd]) => `  <span class="out-green">${name.padEnd(12)}</span>${cmd.description}`)
          .join('\n');
        return `${rows}\n  <span class="out-dim">hints: ↑/↓ history · Tab completion · try breaking something</span>`;
      },
    },
    whoami: {
      description: 'who is behind this terminal',
      run: () => 'Diyar Faraj — Senior Backend, DevOps & Cloud Engineer',
    },
    about: {
      description: 'print README.md',
      run: () =>
        'Backend & DevOps engineer with 10 years industry experience specializing\n' +
        'in .NET, Linux, Kubernetes, and Azure DevOps CI/CD.\n' +
        'Hands-on experience with Linux migrations, micro-services, and cloud\n' +
        'infrastructure. Certified within cloud and software architecture.',
    },
    skills: {
      description: 'ls skills/',
      run: () =>
        '<span class="out-blue">.NET/</span>  <span class="out-blue">csharp/</span>  <span class="out-blue">kubernetes/</span>  <span class="out-blue">docker/</span>  ' +
        '<span class="out-blue">azure-devops/</span>  <span class="out-blue">linux/</span>  <span class="out-blue">ci-cd/</span>  <span class="out-blue">micro-services/</span>',
    },
    certs: {
      description: 'list certifications',
      run: () =>
        `  <span class="out-green">✔</span> Software Architecture — <a href="https://verified.sertifier.com/en/verify/24510104985669" target="_blank" rel="noopener noreferrer">verify</a>\n` +
        `  <span class="out-green">✔</span> Azure Fundamentals (AZ-900) — <a href="https://www.credly.com/badges/749dd063-46a2-4626-964f-e14cc2bbf69d/public_url" target="_blank" rel="noopener noreferrer">verify</a>\n` +
        `  <span class="out-green">✔</span> AWS Cloud Practitioner — <a href="https://www.credly.com/badges/2e3c2352-746a-4af1-a9b7-4c6c1701b5fa/public_url" target="_blank" rel="noopener noreferrer">verify</a>\n` +
        `  <span class="out-green">✔</span> Azure AI Fundamentals (AI-900) — <a href="https://www.credly.com/badges/a57d2d60-3b88-4654-9e81-ed9c2ffc3117" target="_blank" rel="noopener noreferrer">verify</a>`,
    },
    contact: {
      description: 'open a channel',
      run: () =>
        `  <a href="https://www.linkedin.com/in/diyar-faraj/" target="_blank" rel="noopener noreferrer">LinkedIn</a>   ` +
        `<a href="https://github.com/diyarfaraj" target="_blank" rel="noopener noreferrer">GitHub</a>   ` +
        `<a href="mailto:diyar.faraj@gmail.com">diyar.faraj@gmail.com</a>`,
    },
    neofetch: {
      description: 'system information',
      run: () => this.neofetch(),
    },
    ls: {
      description: 'list directory contents',
      run: () =>
        '<span class="out-blue">skills/</span>  <span class="out-blue">certs/</span>  <span class="out-blue">contact/</span>  README.md  <span class="out-dim">.bash_history</span>',
    },
    pwd: {
      description: 'print working directory',
      run: () => '/home/diyar',
    },
    date: {
      description: 'print current date',
      run: () => new Date().toString(),
    },
    uname: {
      description: 'system info',
      run: (args) =>
        args.includes('-a')
          ? 'Linux diyarfaraj.com 6.10-portfolio #1 SMP PREEMPT x86_64 GNU/Linux'
          : 'Linux',
    },
    echo: {
      description: 'echo arguments',
      run: (args) => escapeHtml(args.join(' ')),
    },
    history: {
      description: 'command history',
      run: () => this.history.map((cmd, i) => `  ${String(i + 1).padStart(3)}  ${escapeHtml(cmd)}`).join('\n') || '  (empty)',
    },
    clear: {
      description: 'clear the terminal',
      run: () => {
        this.output.innerHTML = '';
      },
    },
    matrix: {
      description: 'follow the white rabbit',
      run: () => {
        if (REDUCED_MOTION) return '<span class="out-dim">reduced-motion is on — the rabbit respects your settings.</span>';
        this.matrix.run(8000);
        return '<span class="out-green">Wake up, Neo...</span>';
      },
    },
    exit: {
      description: 'close session',
      run: () => '<span class="out-dim">logout\nConnection to portfolio closed. (You can never really leave — try</span> <span class="out-green">contact</span> <span class="out-dim">instead.)</span>',
    },
  };

  constructor(matrix: MatrixRain) {
    this.matrix = matrix;
    this.input = document.getElementById('shellInput') as HTMLInputElement;
    this.output = document.getElementById('shellOutput') as HTMLElement;
    this.section = document.querySelector('.shell-section') as HTMLElement;
    if (!this.input || !this.output || !this.section) return;

    this.input.addEventListener('keydown', (e) => this.onKeyDown(e));

    // Clicking anywhere non-interactive inside the terminal focuses the prompt
    document.querySelector('.terminal-window')?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, .cert-item')) return;
      if (window.getSelection()?.toString()) return;
      this.input.focus({ preventScroll: true });
    });
  }

  public activate(): void {
    this.section?.classList.add('shell-ready');
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      const raw = this.input.value.trim();
      this.input.value = '';
      this.execute(raw);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length && this.historyIndex > 0) this.historyIndex--;
      else if (this.historyIndex === -1) this.historyIndex = this.history.length - 1;
      this.input.value = this.history[this.historyIndex] ?? '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex === -1) return;
      this.historyIndex++;
      if (this.historyIndex >= this.history.length) {
        this.historyIndex = -1;
        this.input.value = '';
      } else {
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = this.input.value.trimStart();
      if (!partial || partial.includes(' ')) return;
      const matches = Object.keys(this.commands).filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        this.input.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        this.print(`<span class="out-dim">${matches.join('  ')}</span>`);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      this.output.innerHTML = '';
    } else if (e.key === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
      this.echoLine(this.input.value + '^C');
      this.input.value = '';
    }
  }

  private execute(raw: string): void {
    this.echoLine(raw);
    this.historyIndex = -1;
    if (!raw) return;

    this.history.push(raw);

    const [name, ...args] = raw.split(/\s+/);
    const lower = name.toLowerCase();

    // Easter eggs & aliases before the regular dispatch
    if (lower === 'sudo') {
      if (raw.replace(/\s+/g, ' ').includes('rm -rf')) {
        this.print('<span class="out-red">Nice try.</span> This portfolio is mounted read-only.');
      } else {
        this.print(`visitor is not in the sudoers file. <span class="out-amber">This incident will be reported.</span>`);
      }
      return;
    }
    if (lower === 'rm') {
      this.print(`rm: cannot remove: <span class="out-red">Permission denied</span> (immutable portfolio)`);
      return;
    }
    if (lower === 'vim' || lower === 'vi' || lower === 'nano' || lower === 'emacs') {
      this.print(`<span class="out-dim">You are now trapped in ${lower}. Just kidding — :q! saved you.</span>`);
      return;
    }
    if (lower === 'cat' && args[0]?.toLowerCase().includes('readme')) {
      this.print(this.commands.about.run([]) as string);
      return;
    }
    if (lower === 'ssh' && args[0] === 'contact') {
      this.print(this.commands.contact.run([]) as string);
      return;
    }

    const cmd = this.commands[lower];
    if (!cmd) {
      this.print(`bash: ${escapeHtml(name)}: command not found. Try <span class="out-green">help</span>.`);
      return;
    }

    const result = cmd.run(args);
    if (typeof result === 'string') this.print(result);
  }

  private echoLine(raw: string): void {
    this.print(
      `<span class="out-green">visitor@portfolio</span>:<span class="out-blue">~</span>$ ${escapeHtml(raw)}`
    );
  }

  private print(html: string): void {
    const pre = document.createElement('pre');
    pre.innerHTML = html;
    this.output.appendChild(pre);
    this.output.scrollTop = this.output.scrollHeight;
  }

  private neofetch(): string {
    const art = [
      '    .--.    ',
      '   |o_o |   ',
      '   |:_/ |   ',
      '  //   \\ \\  ',
      ' (|     | ) ',
      "/'\\_   _/`\\",
      '\\___)=(___/ ',
    ];
    const info = [
      '<span class="out-green">diyar</span>@<span class="out-green">portfolio</span>',
      '<span class="out-dim">-----------------</span>',
      '<span class="out-green">OS</span>:      Linux (btw)',
      '<span class="out-green">Role</span>:    Senior Backend / DevOps / Cloud',
      '<span class="out-green">Uptime</span>:  10+ years in production',
      '<span class="out-green">Shell</span>:   C#, bash, YAML (too much YAML)',
      '<span class="out-green">Stack</span>:   .NET · Kubernetes · Azure DevOps',
      '<span class="out-green">Certs</span>:   4 <span class="out-dim">(run `certs`)</span>',
      '<span class="out-green">CPU</span>:     Caffeine @ 4.0GHz',
    ];
    return art.map((line, i) => `<span class="out-green">${line}</span>  ${info[i] ?? ''}`).join('\n');
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// =====================================================
// Matrix rain (easter egg: `matrix` command)
// =====================================================

class MatrixRain {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private raf = 0;
  private stopTimer = 0;
  private glyphs = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇ01アイウエオ';

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'matrix-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  public run(durationMs: number): void {
    if (!this.ctx) return;
    cancelAnimationFrame(this.raf);
    clearTimeout(this.stopTimer);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fontSize = 16;
    const columns = Math.ceil(window.innerWidth / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -40);

    this.canvas.classList.add('active');

    const draw = () => {
      const ctx = this.ctx!;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = '#33ff33';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const char = this.glyphs[Math.floor(Math.random() * this.glyphs.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      this.raf = requestAnimationFrame(draw);
    };
    draw();

    this.stopTimer = window.setTimeout(() => {
      this.canvas.classList.remove('active');
      // Let the fade-out transition finish before halting the animation
      window.setTimeout(() => {
        cancelAnimationFrame(this.raf);
        this.ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }, 700);
    }, durationMs);
  }
}

// =====================================================
// Certificate Modal
// =====================================================

class CertModal {
  private modal: HTMLElement | null;
  private modalImage: HTMLImageElement | null;
  private lastFocused: HTMLElement | null = null;

  constructor() {
    this.modal = document.getElementById('certModal');
    this.modalImage = document.getElementById('certModalImage') as HTMLImageElement | null;
    if (!this.modal || !this.modalImage) return;

    const backdrop = this.modal.querySelector<HTMLElement>('.cert-modal-backdrop');
    const closeBtn = this.modal.querySelector<HTMLElement>('.cert-modal-close');

    document.querySelectorAll('.cert-view').forEach((btn) => {
      btn.addEventListener('click', () => {
        const img = btn.closest('.cert-item')?.querySelector('img');
        if (img) this.open(img.src, img.alt, btn as HTMLElement);
      });
    });

    document.querySelectorAll('.cert-visit').forEach((btn) => {
      btn.addEventListener('click', () => {
        const url = (btn.closest('.cert-item') as HTMLElement)?.dataset.url;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      });
    });

    backdrop?.addEventListener('click', () => this.close());
    closeBtn?.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('active')) this.close();
    });
  }

  private open(src: string, alt: string, trigger: HTMLElement): void {
    if (!this.modal || !this.modalImage) return;
    this.lastFocused = trigger;
    this.modalImage.src = src;
    this.modalImage.alt = alt;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.modal.querySelector<HTMLElement>('.cert-modal-close')?.focus();
  }

  private close(): void {
    this.modal?.classList.remove('active');
    document.body.style.overflow = '';
    this.lastFocused?.focus();
  }
}

// =====================================================
// Certificate hover glitch
// =====================================================

class CertGlitch {
  private baseFilter = 'grayscale(100%) sepia(100%) hue-rotate(90deg) saturate(1.5) brightness(0.9) contrast(1.2)';
  private intervals = new WeakMap<HTMLImageElement, number>();

  constructor() {
    if (REDUCED_MOTION) return;

    document.querySelectorAll('.cert-item').forEach((item) => {
      const img = item.querySelector('img');
      if (!img) return;
      item.addEventListener('mouseenter', () => this.start(img));
      item.addEventListener('mouseleave', () => this.stop(img));
    });
  }

  private start(img: HTMLImageElement): void {
    this.stop(img);
    const id = window.setInterval(() => {
      if (Math.random() < 0.6) {
        const hue = 90 + (Math.random() * 60 - 30);
        const saturate = 1 + Math.random() * 2;
        const brightness = 0.7 + Math.random() * 0.6;
        const contrast = 1 + Math.random() * 0.5;
        img.style.filter = `grayscale(100%) sepia(100%) hue-rotate(${hue}deg) saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;
        setTimeout(() => {
          if (this.intervals.has(img)) img.style.filter = this.baseFilter;
        }, 50 + Math.random() * 50);
      }
    }, 100 + Math.random() * 100);
    this.intervals.set(img, id);
  }

  private stop(img: HTMLImageElement): void {
    const id = this.intervals.get(img);
    if (id !== undefined) {
      clearInterval(id);
      this.intervals.delete(img);
    }
    img.style.filter = this.baseFilter;
  }
}

// =====================================================
// Status bar clock + last-login line
// =====================================================

function initChrome(): void {
  const lastLogin = document.getElementById('lastLogin');
  if (lastLogin) {
    const now = new Date();
    const stamp = now.toDateString().replace(/^(\w+) /, '$1 ') + ' ' + now.toTimeString().slice(0, 8);
    lastLogin.textContent = `Last login: ${stamp} from 10.0.0.42 on ttys001`;
  }

  const clock = document.getElementById('statusClock');
  if (clock) {
    const tick = () => {
      clock.textContent = new Date().toTimeString().slice(0, 5);
    };
    tick();
    setInterval(tick, 30_000);
  }
}

// =====================================================
// Boot
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  initChrome();

  const matrix = new MatrixRain();
  const shell = new Shell(matrix);
  new CertModal();
  new CertGlitch();

  const startDelay = REDUCED_MOTION ? 0 : 400;
  setTimeout(() => {
    new TerminalTyping(() => shell.activate()).start();
  }, startDelay);
});
