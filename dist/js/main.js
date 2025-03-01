// Select DOM items
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
const menuNav = document.querySelector(".menu-nav");
const menuBranding = document.querySelector(".menu-branding");
const navItems = document.querySelectorAll(".nav-item");
const chatBottom = document.querySelector(".text-center");

// set initial state of menu
let showMenu = false;
console.log(chatBottom);

menuBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  if (!showMenu) {
    menuBtn.classList.add("close");
    menu.classList.add("show");
    menuNav.classList.add("show");
    menuBranding.classList.add("show");
    navItems.forEach((item) => item.classList.add("show"));

    showMenu = true;
  } else {
    menuBtn.classList.remove("close");
    menu.classList.remove("show");
    menuNav.classList.remove("show");
    menuBranding.classList.remove("show");
    navItems.forEach((item) => item.classList.remove("show"));

    showMenu = false;
  }
}

var Messenger = function (el) {
  "use strict";
  var m = this;

  m.init = function () {
    // More Matrix-like characters including Japanese-inspired symbols
    m.codeletters = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01010101";
    m.message = 0;
    m.current_length = 0;
    m.fadeBuffer = false;
    m.glitchInterval = null;
    m.trailChars = [];
    m.messages = [
      "Software Engineer",
      "C#/.NET, React, Vue, Flutter",
      "DevOps",
      "Kubernetes",
      "Linux",
      "Azure",
    ];

    // Add matrix styling with CSS
    $(el).css({
      'color': '#0f0',
      'text-shadow': '0 0 5px #0f0, 0 0 10px #0f0',
      'font-family': 'monospace, consolas, courier new'
    });
    
    // Create background element for matrix effect
    $('body').append('<div id="matrix-bg"></div>');
    $('#matrix-bg').css({
      'position': 'fixed',
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
      'pointer-events': 'none',
      'z-index': -1,
      'opacity': 0.1
    });
    
    // Start the glitch effect
    m.startGlitchEffect();
    
    setTimeout(m.animateIn, 100);
  };

  m.startGlitchEffect = function() {
    // Occasionally glitch the text
    m.glitchInterval = setInterval(function() {
      if (Math.random() < 0.1) {
        let originalText = $(el).html();
        let glitchText = originalText.split('').map(char => {
          return Math.random() < 0.3 ? m.codeletters.charAt(Math.floor(Math.random() * m.codeletters.length)) : char;
        }).join('');
        
        $(el).html(glitchText);
        
        // Restore after brief glitch
        setTimeout(function() {
          $(el).html(originalText);
        }, 50 + Math.random() * 100);
      }
    }, 1000);
  };

  m.generateRandomString = function (length) {
    var random_text = "";
    while (random_text.length < length) {
      random_text += m.codeletters.charAt(
        Math.floor(Math.random() * m.codeletters.length)
      );
    }

    return random_text;
  };

  m.animateIn = function () {
    if (m.current_length < m.messages[m.message].length) {
      // Speed varies slightly for more organic feeling
      m.current_length = m.current_length + (Math.random() < 0.3 ? 1 : 2);
      if (m.current_length > m.messages[m.message].length) {
        m.current_length = m.messages[m.message].length;
      }

      var message = m.generateRandomString(m.current_length);
      $(el).html(message);

      // Slightly randomized timing
      setTimeout(m.animateIn, 10 + Math.random() * 30);
    } else {
      setTimeout(m.animateFadeBuffer, 20);
    }
  };

  m.animateFadeBuffer = function () {
    if (m.fadeBuffer === false) {
      m.fadeBuffer = [];
      for (var i = 0; i < m.messages[m.message].length; i++) {
        m.fadeBuffer.push({
          c: Math.floor(Math.random() * 18) + 1, // More iterations for matrix-like effect
          l: m.messages[m.message].charAt(i),
          flicker: Math.random() < 0.4, // Some characters will flicker
        });
      }
    }

    var do_cycles = false;
    var message = "";

    for (var i = 0; i < m.fadeBuffer.length; i++) {
      var fader = m.fadeBuffer[i];
      if (fader.c > 0) {
        do_cycles = true;
        fader.c--;
        message += m.codeletters.charAt(
          Math.floor(Math.random() * m.codeletters.length)
        );
      } else {
        // Occasionally flicker even after character is revealed
        if (fader.flicker && Math.random() < 0.03) {
          message += m.codeletters.charAt(
            Math.floor(Math.random() * m.codeletters.length)
          );
        } else {
          message += fader.l;
        }
      }
    }

    $(el).html(message);

    if (do_cycles === true) {
      setTimeout(m.animateFadeBuffer, 40 + Math.random() * 20);
    } else {
      setTimeout(m.cycleText, 2000);
    }
  };

  m.cycleText = function () {
    m.message = m.message + 1;
    if (m.message >= m.messages.length) {
      m.message = 0;
    }

    m.current_length = 0;
    m.fadeBuffer = false;
    $(el).html("");

    setTimeout(m.animateIn, 200);
  };

  m.init();
  
  // Cleanup function to remove intervals when needed
  m.destroy = function() {
    if (m.glitchInterval) {
      clearInterval(m.glitchInterval);
    }
  };
};

var messenger = new Messenger($("#messenger"));

// Add falling matrix characters in background
function createMatrixRain() {
  const matrixBg = document.getElementById('matrix-bg');
  if (!matrixBg) return;
  
  const width = window.innerWidth;
  const charCount = Math.floor(width / 20); // Approx number of columns
  
  for (let i = 0; i < charCount; i++) {
    let column = document.createElement('div');
    column.className = 'matrix-column';
    column.style.left = (i * 20) + 'px';
    column.style.animationDelay = (Math.random() * 5) + 's';
    column.style.position = 'absolute';
    column.style.top = '0';
    column.style.color = '#0f0';
    column.style.fontSize = '16px';
    column.style.textShadow = '0 0 5px #0f0';
    column.style.opacity = (0.1 + Math.random() * 0.5);
    
    const height = Math.floor(Math.random() * 30) + 10;
    for (let j = 0; j < height; j++) {
      let char = document.createElement('div');
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

// Initialize the matrix rain effect
setTimeout(createMatrixRain, 300);

// Add some CSS for animations
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

// Add the glitching effect to the first name with flickering light
function glitchFirstName() {
  const firstNameEl = document.querySelector('.text-secondary');
  if (!firstNameEl) return;
  
  // Store the original text
  const originalText = firstNameEl.textContent;
  
  // Matrix-like characters
  const matrixChars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01010101";
  
  // Apply Matrix styling
  firstNameEl.style.color = '#0f0';
  firstNameEl.style.textShadow = '0 0 5px #0f0, 0 0 10px #0f0';
  firstNameEl.style.transition = 'text-shadow 0.05s, color 0.05s';
  
  // Normal bright glow state
  const normalGlow = '0 0 5px #0f0, 0 0 10px #0f0';
  const normalColor = '#0f0';
  
  // Different dimmer states to simulate flickering
  const dimStates = [
    { shadow: '0 0 3px #0a0, 0 0 5px #0a0', color: '#0b0' },
    { shadow: '0 0 2px #080, 0 0 4px #080', color: '#0a0' },
    { shadow: '0 0 1px #050, 0 0 2px #050', color: '#080' },
    { shadow: 'none', color: '#050' }  // Almost burned out
  ];
  
  // Flicker the light randomly
  function flickerLight() {
    // 25% chance of flicker occurring
    if (Math.random() < 0.25) {
      // Choose how severe the flicker is
      let severity;
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
      firstNameEl.style.textShadow = dimStates[severity].shadow;
      firstNameEl.style.color = dimStates[severity].color;
      
      // Sometimes have multiple flickers in succession
      const flickers = (Math.random() < 0.3) ? Math.floor(Math.random() * 3) + 2 : 1;
      let flickerCount = 0;
      
      // Function to flicker back and forth
      function singleFlicker() {
        setTimeout(() => {
          // Flip between dim and normal
          if (flickerCount % 2 === 0) {
            // Back to normal
            firstNameEl.style.textShadow = normalGlow;
            firstNameEl.style.color = normalColor;
          } else {
            // Dim again, possibly with different intensity
            const newSeverity = Math.min(Math.floor(Math.random() * 4), 3);
            firstNameEl.style.textShadow = dimStates[newSeverity].shadow;
            firstNameEl.style.color = dimStates[newSeverity].color;
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
  
  // Set up occasional glitching
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
      firstNameEl.textContent = textArray.join('');
      
      // Reset after a brief moment (50-150ms)
      setTimeout(() => {
        firstNameEl.textContent = originalText;
      }, 50 + Math.random() * 100);
    }
    
    // Check for light flicker with independent timing
    flickerLight();
    
  }, 800); // Check for potential effects every 800ms
}

// Initialize first name glitch effect
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit before starting the first name glitch effect
  setTimeout(glitchFirstName, 500);
});
