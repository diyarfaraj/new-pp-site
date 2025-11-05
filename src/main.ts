/**
 * Portfolio Website - Main TypeScript
 * Diyar Faraj - Software Engineer
 *
 * Features:
 * - Matrix-style messenger animation with cycling text
 * - Falling matrix rain background effect
 * - First name glitch/flicker effect
 *
 * No external dependencies - Pure Vanilla TypeScript
 */

// ======================
// TYPE DEFINITIONS
// ======================

interface FadeBufferItem {
  c: number;
  l: string;
  flicker: boolean;
}

interface DimState {
  shadow: string;
  color: string;
}

// ======================
// MESSENGER ANIMATION
// ======================

/**
 * Messenger class - Creates Matrix-style typing animation
 * Cycles through messages with random character effects
 */
class Messenger {
  private el: HTMLElement;
  private codeletters: string;
  private message: number;
  private current_length: number;
  private fadeBuffer: FadeBufferItem[] | false;
  private glitchInterval: number | null;
  private messages: string[];

  constructor(el: HTMLElement) {
    this.el = el;
    this.codeletters = '';
    this.message = 0;
    this.current_length = 0;
    this.fadeBuffer = false;
    this.glitchInterval = null;
    this.messages = [];
    this.init();
  }

  /**
   * Initialize the messenger with configuration and styling
   */
  private init(): void {
    // Matrix-like character set including Japanese-inspired symbols
    this.codeletters = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01010101";

    // Current message index
    this.message = 0;

    // Current character length being animated
    this.current_length = 0;

    // Buffer for fade-in effect
    this.fadeBuffer = false;

    // Interval for glitch effect
    this.glitchInterval = null;

    // Messages to cycle through
    this.messages = [
      "Software Engineer",
      "C#/.NET, React, Vue, Flutter",
      "DevOps",
      "Kubernetes",
      "Linux",
      "Azure",
    ];

    // Apply Matrix-style CSS
    this.el.style.color = '#0f0';
    this.el.style.textShadow = '0 0 10px #0f0, 0 0 20px #0f0';
    this.el.style.fontFamily = 'monospace, consolas, courier new';
    this.el.style.fontSize = '11px';
    this.el.style.position = 'static';
    this.el.style.transform = 'none';
    this.el.style.textAlign = 'left';

    // Create background element for matrix effect - disabled, using background image
    // this.createMatrixBackground();

    // Start the glitch effect
    this.startGlitchEffect();

    // Start animation
    setTimeout(() => this.animateIn(), 100);
  }

  /**
   * Starts random glitch effect on text
   */
  private startGlitchEffect(): void {
    this.glitchInterval = window.setInterval(() => {
      if (Math.random() < 0.1) {
        const originalText = this.el.textContent || '';
        const glitchText = originalText.split('').map(char =>
          Math.random() < 0.3
            ? this.codeletters.charAt(Math.floor(Math.random() * this.codeletters.length))
            : char
        ).join('');

        this.el.textContent = glitchText;

        // Restore after brief glitch
        setTimeout(() => {
          this.el.textContent = originalText;
        }, 50 + Math.random() * 100);
      }
    }, 1000);
  }

  /**
   * Generates random string of specified length from codeletters
   */
  private generateRandomString(length: number): string {
    let random_text = "";
    while (random_text.length < length) {
      random_text += this.codeletters.charAt(
        Math.floor(Math.random() * this.codeletters.length)
      );
    }
    return random_text;
  }

  /**
   * Animates text in with random characters
   */
  private animateIn(): void {
    if (this.current_length < this.messages[this.message].length) {
      // Speed varies slightly for more organic feeling
      this.current_length = this.current_length + (Math.random() < 0.3 ? 1 : 2);
      if (this.current_length > this.messages[this.message].length) {
        this.current_length = this.messages[this.message].length;
      }

      const message = this.generateRandomString(this.current_length);
      this.el.textContent = message;

      // Slightly randomized timing
      setTimeout(() => this.animateIn(), 10 + Math.random() * 30);
    } else {
      setTimeout(() => this.animateFadeBuffer(), 20);
    }
  }

  /**
   * Fades in actual message characters from random characters
   */
  private animateFadeBuffer(): void {
    if (this.fadeBuffer === false) {
      this.fadeBuffer = [];
      for (let i = 0; i < this.messages[this.message].length; i++) {
        this.fadeBuffer.push({
          c: Math.floor(Math.random() * 18) + 1, // More iterations for matrix-like effect
          l: this.messages[this.message].charAt(i),
          flicker: Math.random() < 0.4, // Some characters will flicker
        });
      }
    }

    let do_cycles = false;
    let message = "";

    for (let i = 0; i < this.fadeBuffer.length; i++) {
      const fader = this.fadeBuffer[i];
      if (fader.c > 0) {
        do_cycles = true;
        fader.c--;
        message += this.codeletters.charAt(
          Math.floor(Math.random() * this.codeletters.length)
        );
      } else {
        // Occasionally flicker even after character is revealed
        if (fader.flicker && Math.random() < 0.03) {
          message += this.codeletters.charAt(
            Math.floor(Math.random() * this.codeletters.length)
          );
        } else {
          message += fader.l;
        }
      }
    }

    this.el.textContent = message;

    if (do_cycles === true) {
      setTimeout(() => this.animateFadeBuffer(), 40 + Math.random() * 20);
    } else {
      setTimeout(() => this.cycleText(), 2000);
    }
  }

  /**
   * Cycles to next message
   */
  private cycleText(): void {
    this.message = this.message + 1;
    if (this.message >= this.messages.length) {
      this.message = 0;
    }

    this.current_length = 0;
    this.fadeBuffer = false;
    this.el.textContent = "";

    setTimeout(() => this.animateIn(), 200);
  }

  /**
   * Cleanup function to remove intervals
   */
  public destroy(): void {
    if (this.glitchInterval) {
      clearInterval(this.glitchInterval);
    }
  }
}

// ======================
// MATRIX RAIN EFFECT
// ======================

/**
 * Creates falling matrix rain characters in background
 */
function createMatrixRain(): void {
  const matrixBg = document.getElementById('matrix-bg');
  if (!matrixBg) return;

  const width = window.innerWidth;
  const charCount = Math.floor(width / 20); // Approx number of columns

  for (let i = 0; i < charCount; i++) {
    const column = document.createElement('div');
    column.className = 'matrix-column';

    Object.assign(column.style, {
      left: (i * 20) + 'px',
      animationDelay: (Math.random() * 5) + 's',
      position: 'absolute',
      top: '0',
      color: '#0f0',
      fontSize: '4px',
      textShadow: '0 0 5px #0f0',
      opacity: (0.1 + Math.random() * 0.5).toString()
    });

    const height = Math.floor(Math.random() * 30) + 10;
    for (let j = 0; j < height; j++) {
      const char = document.createElement('div');
      char.textContent = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01010101".charAt(
        Math.floor(Math.random() * "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01010101".length)
      );
      char.style.animation = `matrix-fall ${5 + Math.random() * 10}s linear infinite`;
      char.style.animationDelay = (j * 0.1) + 's';
      column.appendChild(char);
    }

    matrixBg.appendChild(column);
  }
}

// ======================
// FIRST NAME GLITCH EFFECT
// ======================

/**
 * Adds glitching effect to first name with flickering light
 */
function glitchFirstName(): void {
  const firstNameEl = document.querySelector('.text-secondary') as HTMLElement | null;
  if (!firstNameEl) return;

  // Store the original text
  const originalText = firstNameEl.textContent || '';

  // Matrix-like characters
  const matrixChars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01010101";

  // Apply Matrix styling
  Object.assign(firstNameEl.style, {
    color: '#0f0',
    textShadow: '0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0',
    transition: 'text-shadow 0.05s, color 0.05s'
  });

  // Normal bright glow state
  const normalGlow = '0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0';
  const normalColor = '#0f0';

  // Different dimmer states to simulate flickering
  const dimStates: DimState[] = [
    { shadow: '0 0 8px #0f0, 0 0 15px #0f0', color: '#0c0' },
    { shadow: '0 0 5px #0a0', color: '#0a0' },
    { shadow: '0 0 3px #080', color: '#080' },
    { shadow: 'none', color: '#050' }  // Almost burned out
  ];

  /**
   * Flickers the light randomly
   */
  function flickerLight(): void {
    // 25% chance of flicker occurring
    if (Math.random() < 0.25) {
      // Choose how severe the flicker is
      let severity: number;
      const rand = Math.random();

      if (rand < 0.6) {
        // Minor flicker (60% chance)
        severity = 0;
      } else if (rand < 0.9) {
        // Medium flicker (30% chance)
        severity = 1;
      } else {
        // Major flicker/brownout (10% chance)
        severity = Math.floor(Math.random() * 2) + 2; // Either 2 or 3
      }

      // Apply the flicker effect
      firstNameEl!.style.textShadow = dimStates[severity].shadow;
      firstNameEl!.style.color = dimStates[severity].color;

      // Sometimes have multiple flickers in succession
      const flickers = (Math.random() < 0.3) ? Math.floor(Math.random() * 3) + 2 : 1;
      let flickerCount = 0;

      // Function to flicker back and forth
      function singleFlicker(): void {
        setTimeout(() => {
          // Flip between dim and normal
          if (flickerCount % 2 === 0) {
            // Back to normal
            firstNameEl!.style.textShadow = normalGlow;
            firstNameEl!.style.color = normalColor;
          } else {
            // Dim again, possibly with different intensity
            const newSeverity = Math.min(Math.floor(Math.random() * 4), 3);
            firstNameEl!.style.textShadow = dimStates[newSeverity].shadow;
            firstNameEl!.style.color = dimStates[newSeverity].color;
          }

          flickerCount++;
          if (flickerCount < flickers * 2) {
            singleFlicker();
          }
        }, 30 + Math.random() * 100); // Random timing between flickers
      }

      singleFlicker();
    }
  }

  // Set up occasional glitching and flickering
  setInterval(() => {
    // Glitch characters occasionally (20% chance)
    if (Math.random() < 0.2) {
      // Create a glitched version of the text
      const textArray = originalText.split('');

      // Randomly replace 1-2 characters
      const numGlitches = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numGlitches; i++) {
        const glitchPos = Math.floor(Math.random() * textArray.length);
        textArray[glitchPos] = matrixChars.charAt(
          Math.floor(Math.random() * matrixChars.length)
        );
      }

      // Apply glitched text
      firstNameEl!.textContent = textArray.join('');

      // Reset after a brief moment (50-150ms)
      setTimeout(() => {
        firstNameEl!.textContent = originalText;
      }, 50 + Math.random() * 100);
    }

    // Check for light flicker with independent timing
    flickerLight();

  }, 800); // Check for potential effects every 800ms
}

// ======================
// CSS ANIMATIONS
// ======================

/**
 * Injects CSS keyframe animations for matrix effects
 */
function injectMatrixAnimations(): void {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes matrix-fall {
      0% { transform: translateY(-100vh); opacity: 1; }
      80% { opacity: 0.8; }
      100% { transform: translateY(100vh); opacity: 0; }
    }

    .matrix-column {
      animation: matrix-sway 3s ease-in-out infinite alternate;
    }

    @keyframes matrix-sway {
      from { transform: translateX(-10px); }
      to { transform: translateX(10px); }
    }
  `;
  document.head.appendChild(style);
}

// ======================
// INITIALIZATION
// ======================

/**
 * Initialize all effects when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize messenger animation
  const messengerEl = document.getElementById('messenger');
  if (messengerEl) {
    new Messenger(messengerEl);
  }

  // Inject CSS animations (keeping for potential future use)
  // injectMatrixAnimations();

  // Matrix rain effect disabled - using background image instead
  // setTimeout(createMatrixRain, 300);

  // Initialize first name glitch effect
  setTimeout(glitchFirstName, 500);
});
