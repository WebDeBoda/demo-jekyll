/**
 * Selector de Tema Dinámico
 * Permite cambiar los colores de la web de forma dinámica
 */

class ThemeSelector {
  constructor() {
    this.currentTheme = 'default';
    this.themes = {
      default: {
        name: 'Verde Clásico',
        colors: {
          '--color-primary-base': '#77BFA3',
          '--color-primary-dark': '#558F7E',
          '--color-primary-darker': '#355E4B',
          '--color-primary-light': '#B6D3C9',
          '--color-primary-lighter': '#F0F5F2',
          '--color-accent-warm': '#E2A173',
          '--color-accent-danger': '#913E4E',
          '--color-dark': '#2E443C',
          '--color-gray': '#A3B5AE',
          '--color-gray-dark': '#516760'
        }
      },
      romantic: {
        name: 'Rosa Romántico',
        colors: {
          '--color-primary-base': '#D4A5A5',
          '--color-primary-dark': '#C08585',
          '--color-primary-darker': '#A85C5C',
          '--color-primary-light': '#E8C5C5',
          '--color-primary-lighter': '#F5E5E5',
          '--color-accent-warm': '#E2A173',
          '--color-accent-danger': '#913E4E',
          '--color-dark': '#6B4A4A',
          '--color-gray': '#B8A5A5',
          '--color-gray-dark': '#6B5C5C'
        }
      },
      elegant: {
        name: 'Azul Elegante',
        colors: {
          '--color-primary-base': '#7B9ACC',
          '--color-primary-dark': '#5B7AAC',
          '--color-primary-darker': '#3B5A8C',
          '--color-primary-light': '#B8C9E0',
          '--color-primary-lighter': '#E8EDF5',
          '--color-accent-warm': '#E2A173',
          '--color-accent-danger': '#913E4E',
          '--color-dark': '#3D4A5C',
          '--color-gray': '#A3B0C0',
          '--color-gray-dark': '#5A6777'
        }
      },
      golden: {
        name: 'Dorado Lujoso',
        colors: {
          '--color-primary-base': '#D4AF37',
          '--color-primary-dark': '#B8941F',
          '--color-primary-darker': '#9A7A17',
          '--color-primary-light': '#E8D08A',
          '--color-primary-lighter': '#F5EBD4',
          '--color-accent-warm': '#E2A173',
          '--color-accent-danger': '#913E4E',
          '--color-dark': '#6B5A3D',
          '--color-gray': '#B8B5A5',
          '--color-gray-dark': '#6B685C'
        }
      },
      purple: {
        name: 'Púrpura Real',
        colors: {
          '--color-primary-base': '#9B7BB8',
          '--color-primary-dark': '#7B5B98',
          '--color-primary-darker': '#5B3B78',
          '--color-primary-light': '#C5B3D8',
          '--color-primary-lighter': '#E8E0F0',
          '--color-accent-warm': '#E2A173',
          '--color-accent-danger': '#913E4E',
          '--color-dark': '#4D3A5C',
          '--color-gray': '#B8A5C0',
          '--color-gray-dark': '#6B5C77'
        }
      },
      coral: {
        name: 'Coral Fresco',
        colors: {
          '--color-primary-base': '#F4A261',
          '--color-primary-dark': '#E76F51',
          '--color-primary-darker': '#D65A31',
          '--color-primary-light': '#F8C5A3',
          '--color-primary-lighter': '#FCE8D6',
          '--color-accent-warm': '#E2A173',
          '--color-accent-danger': '#913E4E',
          '--color-dark': '#6B4A3D',
          '--color-gray': '#C0B5A5',
          '--color-gray-dark': '#776B5C'
        }
      }
    };
    
    this.init();
  }

  init() {
    // Crear el HTML del selector primero (necesario para que funcione el color picker)
    this.createSelectorHTML();
    
    // Cargar tema guardado después de crear el HTML
    const savedTheme = localStorage.getItem('wedding-theme');
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        if (themeData.type === 'preset' && this.themes[themeData.name]) {
          this.applyTheme(themeData.name);
          this.updateActivePreset(themeData.name);
        } else if (themeData.type === 'custom') {
          this.applyCustomTheme(themeData.colors);
        }
      } catch (e) {
        console.error('Error loading saved theme:', e);
        // Si hay error, aplicar tema por defecto
        this.updateTimelineSVG(this.themes.default.colors['--color-primary-dark']);
      }
    } else {
      // Si no hay tema guardado, actualizar timeline con color por defecto
      this.updateTimelineSVG(this.themes.default.colors['--color-primary-dark']);
    }
    
    // Agregar event listeners
    this.attachEventListeners();
  }

  createSelectorHTML() {
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-selector-wrapper';
    wrapper.innerHTML = `
      <button class="theme-selector-toggle" aria-label="Cambiar tema">
        <i class="bi bi-palette"></i>
      </button>
      <div class="theme-selector-panel">
        <h3>Personaliza los colores</h3>
        <div class="theme-presets" id="theme-presets"></div>
        <div class="theme-custom-section">
          <label>Color personalizado:</label>
          <div class="theme-color-picker-wrapper">
            <div class="theme-color-picker">
              <input type="color" id="custom-color-picker" value="#77BFA3">
            </div>
            <button class="theme-reset-btn" id="theme-reset-btn">Restaurar</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(wrapper);
    
    // Crear los presets
    this.createPresets();
  }

  createPresets() {
    const presetsContainer = document.getElementById('theme-presets');
    
    Object.keys(this.themes).forEach(themeKey => {
      const theme = this.themes[themeKey];
      const preset = document.createElement('div');
      preset.className = 'theme-preset';
      if (themeKey === this.currentTheme) {
        preset.classList.add('active');
      }
      
      preset.innerHTML = `
        <div class="theme-preset-color">
          <div style="background: ${theme.colors['--color-primary-base']}"></div>
          <div style="background: ${theme.colors['--color-primary-dark']}"></div>
          <div style="background: ${theme.colors['--color-primary-darker']}"></div>
        </div>
        <div class="theme-preset-name">${theme.name}</div>
      `;
      
      preset.addEventListener('click', () => {
        this.applyTheme(themeKey);
        this.updateActivePreset(themeKey);
      });
      
      presetsContainer.appendChild(preset);
    });
  }

  attachEventListeners() {
    const toggle = document.querySelector('.theme-selector-toggle');
    const panel = document.querySelector('.theme-selector-panel');
    const colorPicker = document.getElementById('custom-color-picker');
    const resetBtn = document.getElementById('theme-reset-btn');
    
    // Toggle panel
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle.classList.toggle('active');
      panel.classList.toggle('active');
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        panel.classList.remove('active');
      }
    });
    
    // Color picker personalizado
    colorPicker.addEventListener('change', (e) => {
      const baseColor = e.target.value;
      this.applyCustomColor(baseColor);
      
      // Remover active de todos los presets
      document.querySelectorAll('.theme-preset').forEach(p => {
        p.classList.remove('active');
      });
    });
    
    // Botón reset
    resetBtn.addEventListener('click', () => {
      this.applyTheme('default');
      this.updateActivePreset('default');
      colorPicker.value = this.themes.default.colors['--color-primary-base'];
    });
  }

  applyTheme(themeKey) {
    const theme = this.themes[themeKey];
    if (!theme) return;
    
    this.currentTheme = themeKey;
    
    // Aplicar colores al root
    Object.keys(theme.colors).forEach(variable => {
      document.documentElement.style.setProperty(variable, theme.colors[variable]);
    });
    
    // Actualizar variables RGB derivadas y variables de botones
    this.updateDerivedColors(theme.colors['--color-primary-base']);
    
    // Actualizar --bs-dark-rgb directamente desde el tema
    const darkRgb = this.hexToRgb(theme.colors['--color-dark']);
    if (darkRgb) {
      document.documentElement.style.setProperty('--bs-dark-rgb', `${darkRgb.r},${darkRgb.g},${darkRgb.b}`);
    }
    
    // Actualizar variables de botones específicamente (esto también actualiza el timeline)
    this.updateButtonVariables(theme.colors['--color-primary-base'], theme.colors['--color-primary-dark'], theme.colors['--color-primary-darker']);
    
    // Guardar en localStorage
    localStorage.setItem('wedding-theme', JSON.stringify({
      type: 'preset',
      name: themeKey
    }));
  }

  applyCustomColor(baseColor) {
    // Generar paleta de colores basada en el color base
    const colors = this.generateColorPalette(baseColor);
    
    Object.keys(colors).forEach(variable => {
      document.documentElement.style.setProperty(variable, colors[variable]);
    });
    
    this.updateDerivedColors(baseColor);
    
    // Actualizar --bs-dark-rgb directamente desde los colores generados
    const darkRgb = this.hexToRgb(colors['--color-dark']);
    if (darkRgb) {
      document.documentElement.style.setProperty('--bs-dark-rgb', `${darkRgb.r},${darkRgb.g},${darkRgb.b}`);
    }
    
    // Actualizar variables de botones
    this.updateButtonVariables(colors['--color-primary-base'], colors['--color-primary-dark'], colors['--color-primary-darker']);
    
    // Guardar como tema personalizado
    localStorage.setItem('wedding-theme', JSON.stringify({
      type: 'custom',
      colors: colors
    }));
    
    // Remover active de todos los presets
    document.querySelectorAll('.theme-preset').forEach(p => {
      p.classList.remove('active');
    });
  }

  applyCustomTheme(colors) {
    Object.keys(colors).forEach(variable => {
      document.documentElement.style.setProperty(variable, colors[variable]);
    });
    
    this.updateDerivedColors(colors['--color-primary-base']);
    
    // Actualizar --bs-dark-rgb directamente desde los colores
    const darkRgb = this.hexToRgb(colors['--color-dark']);
    if (darkRgb) {
      document.documentElement.style.setProperty('--bs-dark-rgb', `${darkRgb.r},${darkRgb.g},${darkRgb.b}`);
    }
    
    // Actualizar variables de botones
    this.updateButtonVariables(colors['--color-primary-base'], colors['--color-primary-dark'], colors['--color-primary-darker']);
    
    // Actualizar color picker
    const colorPicker = document.getElementById('custom-color-picker');
    if (colorPicker) {
      colorPicker.value = colors['--color-primary-base'];
    }
    
    // Remover active de todos los presets si es un tema personalizado
    if (this.isCustomTheme()) {
      document.querySelectorAll('.theme-preset').forEach(p => {
        p.classList.remove('active');
      });
    }
  }

  isCustomTheme() {
    const savedTheme = localStorage.getItem('wedding-theme');
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        return themeData.type === 'custom';
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  generateColorPalette(baseColor) {
    // Convertir hex a RGB
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return this.themes.default.colors;
    
    // Generar variaciones
    const darker = this.darkenColor(rgb, 0.3);
    const darker2 = this.darkenColor(rgb, 0.5);
    const lighter = this.lightenColor(rgb, 0.3);
    const lighter2 = this.lightenColor(rgb, 0.5);
    
    return {
      '--color-primary-base': baseColor,
      '--color-primary-dark': this.rgbToHex(darker),
      '--color-primary-darker': this.rgbToHex(darker2),
      '--color-primary-light': this.rgbToHex(lighter),
      '--color-primary-lighter': this.rgbToHex(lighter2),
      '--color-accent-warm': '#E2A173',
      '--color-accent-danger': '#913E4E',
      '--color-dark': this.rgbToHex(this.darkenColor(rgb, 0.7)),
      '--color-gray': this.rgbToHex(this.lightenColor(rgb, 0.2)),
      '--color-gray-dark': this.rgbToHex(this.darkenColor(rgb, 0.4))
    };
  }

  updateDerivedColors(baseColor) {
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return;
    
    // Actualizar variables RGB de Bootstrap
    document.documentElement.style.setProperty('--bs-primary-rgb', `${rgb.r},${rgb.g},${rgb.b}`);
    
    const darker = this.darkenColor(rgb, 0.3);
    document.documentElement.style.setProperty('--bs-secondary-rgb', `${darker.r},${darker.g},${darker.b}`);
    
    const darker2 = this.darkenColor(rgb, 0.5);
    document.documentElement.style.setProperty('--bs-success-rgb', `${darker2.r},${darker2.g},${darker2.b}`);
    
    const lighter = this.lightenColor(rgb, 0.3);
    document.documentElement.style.setProperty('--bs-info-rgb', `${lighter.r},${lighter.g},${lighter.b}`);
    
    const lighter2 = this.lightenColor(rgb, 0.5);
    document.documentElement.style.setProperty('--bs-light-rgb', `${lighter2.r},${lighter2.g},${lighter2.b}`);
  }

  updateButtonVariables(primaryBase, primaryDark, primaryDarker) {
    // Actualizar variables de botones de Bootstrap 5 para btn-primary
    document.documentElement.style.setProperty('--bs-btn-bg', primaryBase);
    document.documentElement.style.setProperty('--bs-btn-border-color', primaryBase);
    document.documentElement.style.setProperty('--bs-btn-hover-bg', primaryDark);
    document.documentElement.style.setProperty('--bs-btn-hover-border-color', primaryDark);
    document.documentElement.style.setProperty('--bs-btn-active-bg', primaryDark);
    document.documentElement.style.setProperty('--bs-btn-active-border-color', primaryDark);
    document.documentElement.style.setProperty('--bs-btn-disabled-bg', primaryBase);
    document.documentElement.style.setProperty('--bs-btn-disabled-border-color', primaryBase);
    
    // Variables para botón secondary
    document.documentElement.style.setProperty('--bs-btn-secondary-bg', primaryDark);
    document.documentElement.style.setProperty('--bs-btn-secondary-border-color', primaryDark);
    document.documentElement.style.setProperty('--bs-btn-secondary-hover-bg', primaryDarker);
    document.documentElement.style.setProperty('--bs-btn-secondary-hover-border-color', primaryDarker);
    document.documentElement.style.setProperty('--bs-btn-secondary-active-bg', primaryDarker);
    document.documentElement.style.setProperty('--bs-btn-secondary-active-border-color', primaryDarker);
    document.documentElement.style.setProperty('--bs-btn-secondary-disabled-bg', primaryDark);
    document.documentElement.style.setProperty('--bs-btn-secondary-disabled-border-color', primaryDark);
    
    // Actualizar SVG del timeline dinámicamente
    this.updateTimelineSVG(primaryDark);
  }

  updateTimelineSVG(color) {
    // Remover el # del color si existe
    const colorHex = color.replace('#', '');
    
    // Crear el SVG con el color dinámico
    const svgPath = `data:image/svg+xml,%3csvg width='309' height='968' viewBox='0 0 309 968' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M23 961C125.667 948.167 313.5 863 227.5 685C185.5 609 139 596.5 58 554C-43.8683 500.551 19 440 141.5 384.5C264 329 365.5 203 267.5 121C252.167 109.833 209 88.5 162.5 80.5C103.946 70.4263 65 63.5 23 18' stroke='%23${colorHex}' stroke-width='3' stroke-dasharray='12 12'/%3E%3Ccircle cx='7.5' cy='960.5' r='7.5'  fill='%23${colorHex}'/%3E%3Ccircle cx='14.5' cy='7.5' r='7.5'  fill='%23${colorHex}'/%3e%3c/svg%3e`;
    
    // Aplicar a todos los elementos .list-timeline
    document.querySelectorAll('.list-timeline').forEach(timeline => {
      timeline.style.setProperty('--timeline-svg', `url("${svgPath}")`);
    });
    
    // También actualizar directamente el ::before usando una clase CSS personalizada
    const style = document.createElement('style');
    style.id = 'timeline-dynamic-style';
    style.textContent = `.list-timeline::before { background-image: url("${svgPath}") !important; }`;
    
    // Remover el estilo anterior si existe
    const existingStyle = document.getElementById('timeline-dynamic-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
  }

  updateActivePreset(themeKey) {
    document.querySelectorAll('.theme-preset').forEach((preset, index) => {
      const keys = Object.keys(this.themes);
      if (keys[index] === themeKey) {
        preset.classList.add('active');
      } else {
        preset.classList.remove('active');
      }
    });
    
    // Actualizar color picker
    const colorPicker = document.getElementById('custom-color-picker');
    if (colorPicker) {
      colorPicker.value = this.themes[themeKey].colors['--color-primary-base'];
    }
  }

  // Utilidades de color
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  rgbToHex(rgb) {
    return "#" + [rgb.r, rgb.g, rgb.b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  }

  darkenColor(rgb, amount) {
    return {
      r: Math.max(0, Math.floor(rgb.r * (1 - amount))),
      g: Math.max(0, Math.floor(rgb.g * (1 - amount))),
      b: Math.max(0, Math.floor(rgb.b * (1 - amount)))
    };
  }

  lightenColor(rgb, amount) {
    return {
      r: Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount)),
      g: Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount)),
      b: Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount))
    };
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeSelector();
  });
} else {
  new ThemeSelector();
}
