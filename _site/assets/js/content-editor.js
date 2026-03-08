/**
 * Editor de Contenido
 * Permite editar textos, imágenes, reordenar secciones y gestionar hoteles/regalos
 */

class ContentEditor {
  constructor() {
    this.sections = [
      { id: 'hero-section', name: 'Hero', icon: '🎨', visible: true, fixed: false },
      { id: 'mapa', name: 'Mapa', icon: '📍', visible: true, fixed: false },
      { id: 'time-left', name: 'Cuenta Atrás', icon: '⏰', visible: true, fixed: true },
      { id: 'dia-boda', name: 'Día de la Boda', icon: '💒', visible: true, fixed: false },
      { id: 'lista-hoteles', name: 'Hoteles', icon: '🏨', visible: true, fixed: false },
      { id: 'lista-novios', name: 'Regalos', icon: '🎁', visible: true, fixed: false }
    ];
    
    this.init();
  }

  init() {
    // Esperar a que el DOM y jQuery estén listos
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.waitForJQuery(() => this.start());
      });
    } else {
      this.waitForJQuery(() => this.start());
    }
  }

  waitForJQuery(callback) {
    if (typeof jQuery !== 'undefined') {
      callback();
    } else {
      setTimeout(() => this.waitForJQuery(callback), 100);
    }
  }

  start() {
    this.createEditorHTML();
    this.loadSavedConfig();
    this.markEditableTexts();
    this.markEditableImages();
    this.setupSectionControls();
    this.addEditButtonsToSections();
    
    // Re-marcar después de cargar contenido dinámico
    setTimeout(() => {
      this.markEditableTexts();
      this.markEditableImages();
      this.addEditButtonsToSections();
    }, 2000);
  }

  createEditorHTML() {
    const wrapper = document.createElement('div');
    wrapper.className = 'content-editor-wrapper';
    wrapper.innerHTML = `
      <button class="content-editor-toggle" aria-label="Editor de contenido">
        <i class="bi bi-pencil-square"></i>
      </button>
      <div class="content-editor-panel">
        <h3>Editor de Contenido</h3>
        <div class="content-editor-section">
          <div class="content-editor-section-title">
            <i class="bi bi-list-ol"></i>
            <span>Secciones</span>
          </div>
          <ul class="sections-list" id="sections-list"></ul>
        </div>
        <div class="content-editor-section">
          <p class="text-muted small mb-0">
            💡 Doble clic en textos e imágenes para editarlos (excepto en Hoteles y Regalos)
          </p>
        </div>
      </div>
    `;
    
    document.body.appendChild(wrapper);
    
    const toggle = wrapper.querySelector('.content-editor-toggle');
    const panel = wrapper.querySelector('.content-editor-panel');
    
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle.classList.toggle('active');
      panel.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        panel.classList.remove('active');
      }
    });
  }

  setupSectionControls() {
    const list = document.getElementById('sections-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    this.sections.forEach((section, index) => {
      const item = document.createElement('li');
      item.className = 'section-item';
      if (!section.visible) item.classList.add('hidden');
      if (section.fixed) item.classList.add('fixed');
      item.draggable = !section.fixed;
      
      item.innerHTML = `
        <div class="section-item-name">
          <span class="section-drag-handle">${section.fixed ? '🔒' : '☰'}</span>
          <span>${section.icon} ${section.name}</span>
        </div>
        <div class="section-item-actions">
          <button class="section-toggle-btn ${section.visible ? '' : 'hidden'}" 
                  data-section-id="${section.id}"
                  title="${section.visible ? 'Ocultar' : 'Mostrar'}">
            <i class="bi ${section.visible ? 'bi-eye' : 'bi-eye-slash'}"></i>
          </button>
        </div>
      `;
      
      if (!section.fixed) {
        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', index);
          item.classList.add('dragging');
        });
        
        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          const afterElement = this.getDragAfterElement(list, e.clientY);
          const dragging = list.querySelector('.dragging');
          if (afterElement == null) {
            list.appendChild(dragging);
          } else {
            list.insertBefore(dragging, afterElement);
          }
        });
        
        item.addEventListener('dragend', (e) => {
          item.classList.remove('dragging');
          this.updateSectionOrder();
        });
      }
      
      const toggleBtn = item.querySelector('.section-toggle-btn');
      toggleBtn.addEventListener('click', () => {
        this.toggleSection(section.id);
      });
      
      list.appendChild(item);
    });
  }

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.section-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  updateSectionOrder() {
    const list = document.getElementById('sections-list');
    const items = Array.from(list.querySelectorAll('.section-item'));
    
    this.sections = items.map(item => {
      const sectionId = item.querySelector('.section-toggle-btn').dataset.sectionId;
      return this.sections.find(s => s.id === sectionId);
    }).filter(s => s);
    
    this.reorderSectionsInDOM();
    this.setupSectionControls();
    this.saveConfig();
  }

  toggleSection(sectionId) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section && !section.fixed) {
      section.visible = !section.visible;
      const sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        sectionEl.style.display = section.visible ? '' : 'none';
      }
      this.setupSectionControls();
      this.saveConfig();
    }
  }

  reorderSectionsInDOM() {
    const main = document.getElementById('content');
    if (!main) return;
    
    const sectionElements = this.sections.map(s => document.getElementById(s.id)).filter(el => el);
    sectionElements.forEach(el => main.appendChild(el));
  }

  markEditableTexts() {
    const selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'li', '.card-title', '.card-text'];
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.closest('.content-editor-wrapper')) return;
        if (el.closest('#time-left')) return;
        if (el.closest('#lista-hoteles')) return;
        if (el.closest('#lista-novios')) return;
        if (el.hasAttribute('data-no-edit')) return;
        if (el.hasAttribute('data-editable')) return;
        if (!el.textContent || !el.textContent.trim()) return;
        
        const editId = this.getElementId(el);
        el.setAttribute('data-edit-id', editId);
        el.classList.add('editable-text');
        el.setAttribute('data-editable', 'true');
        el.setAttribute('title', 'Doble clic para editar');
        
        el.addEventListener('dblclick', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.editText(el);
        });
      });
    });
  }

  markEditableImages() {
    document.querySelectorAll('img').forEach(img => {
      if (img.closest('.content-editor-wrapper')) return;
      if (img.closest('#time-left')) return;
      if (img.closest('#lista-hoteles')) return;
      if (img.closest('#lista-novios')) return;
      if (img.hasAttribute('data-editable-image')) return;
      
      const imageId = this.getImageId(img);
      img.setAttribute('data-edit-image-id', imageId);
      img.setAttribute('data-editable-image', 'true');
      img.classList.add('editable-image');
      img.setAttribute('title', 'Doble clic para editar');
      
      img.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.editImage(img);
      });
    });
  }

  editText(element) {
    const modal = document.createElement('div');
    modal.className = 'text-edit-modal active';
    modal.innerHTML = `
      <div class="text-edit-modal-content">
        <h4>Editar Texto</h4>
        <label>Texto:</label>
        <textarea id="text-edit-textarea">${element.textContent}</textarea>
        <div class="text-edit-modal-actions">
          <button class="text-edit-btn text-edit-btn-secondary" id="text-edit-cancel">Cancelar</button>
          <button class="text-edit-btn text-edit-btn-primary" id="text-edit-save">Guardar</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    const textarea = document.getElementById('text-edit-textarea');
    textarea.focus();
    textarea.select();
    
    document.getElementById('text-edit-save').addEventListener('click', () => {
      const editId = element.getAttribute('data-edit-id');
      const savedTexts = JSON.parse(localStorage.getItem('wedding-content-texts') || '{}');
      savedTexts[editId] = textarea.value;
      localStorage.setItem('wedding-content-texts', JSON.stringify(savedTexts));
      
      element.textContent = textarea.value;
      modal.remove();
      this.showNotification('Texto guardado correctamente', 'success');
    });
    
    document.getElementById('text-edit-cancel').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('text-edit-save').click();
      }
      if (e.key === 'Escape') {
        document.getElementById('text-edit-cancel').click();
      }
    });
  }

  editImage(imgElement) {
    const modal = document.createElement('div');
    modal.className = 'text-edit-modal active';
    modal.innerHTML = `
      <div class="text-edit-modal-content">
        <h4>Editar Imagen</h4>
        <label>URL de la imagen:</label>
        <textarea id="image-edit-src" rows="3">${imgElement.src}</textarea>
        <label>Texto alternativo:</label>
        <input type="text" id="image-edit-alt" value="${imgElement.alt || ''}">
        <div class="text-edit-modal-actions">
          <button class="text-edit-btn text-edit-btn-secondary" id="image-edit-cancel">Cancelar</button>
          <button class="text-edit-btn text-edit-btn-primary" id="image-edit-save">Guardar</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('image-edit-src').focus();
    
    document.getElementById('image-edit-save').addEventListener('click', () => {
      const imageId = imgElement.getAttribute('data-edit-image-id');
      const savedImages = JSON.parse(localStorage.getItem('wedding-content-images') || '{}');
      savedImages[imageId] = {
        src: document.getElementById('image-edit-src').value,
        alt: document.getElementById('image-edit-alt').value
      };
      localStorage.setItem('wedding-content-images', JSON.stringify(savedImages));
      
      imgElement.src = savedImages[imageId].src;
      imgElement.alt = savedImages[imageId].alt;
      modal.remove();
      this.showNotification('Imagen guardada correctamente', 'success');
    });
    
    document.getElementById('image-edit-cancel').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  addEditButtonsToSections() {
    const addEditButton = (sectionId, buttonText, onClickHandler) => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      if (section.querySelector('.section-edit-data-btn')) return;
      
      let container = section.querySelector('.container') || section.querySelector('.overflow-hidden');
      if (!container) container = section;
      
      const containerStyle = window.getComputedStyle(container);
      if (containerStyle.position === 'static') {
        container.style.position = 'relative';
      }
      
      const button = document.createElement('button');
      button.className = 'btn btn-outline-primary section-edit-data-btn';
      button.innerHTML = `<i class="bi bi-pencil me-2"></i>${buttonText}`;
      button.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        background: white !important;
      `;
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClickHandler();
      });
      
      container.appendChild(button);
    };
    
    const addHotelesButton = () => {
      const section = document.getElementById('lista-hoteles');
      if (section && (section.querySelector('.container') || section.querySelector('.overflow-hidden'))) {
        addEditButton('lista-hoteles', 'Editar Hoteles', () => this.openHotelesEditor());
      }
    };
    
    const addRegalosButton = () => {
      const section = document.getElementById('lista-novios');
      if (section && (section.querySelector('.container') || section.querySelector('.overflow-hidden'))) {
        addEditButton('lista-novios', 'Editar Regalos', () => this.openRegalosEditor());
      }
    };
    
    setTimeout(addHotelesButton, 1000);
    setTimeout(addRegalosButton, 1000);
    setTimeout(addHotelesButton, 3000);
    setTimeout(addRegalosButton, 3000);
  }

  openHotelesEditor() {
    const savedHoteles = localStorage.getItem('wedding-hoteles');
    const hoteles = savedHoteles ? JSON.parse(savedHoteles) : [];
    
    const modal = document.createElement('div');
    modal.className = 'text-edit-modal active';
    modal.style.zIndex = '10001';
    modal.innerHTML = `
      <div class="text-edit-modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
        <h4>Editar Hoteles</h4>
        <div id="hoteles-list-container"></div>
        <div class="text-edit-modal-actions mt-3">
          <button class="text-edit-btn text-edit-btn-secondary" id="hoteles-add-btn">+ Añadir Hotel</button>
          <button class="text-edit-btn text-edit-btn-secondary" id="hoteles-cancel-btn">Cancelar</button>
          <button class="text-edit-btn text-edit-btn-primary" id="hoteles-save-btn">Guardar</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const container = document.getElementById('hoteles-list-container');
    const updateList = () => {
      container.innerHTML = hoteles.map((hotel, index) => `
        <div class="mb-3 p-3 border rounded">
          <div class="d-flex justify-content-between mb-2">
            <strong>Hotel ${index + 1}</strong>
            <button class="btn btn-sm btn-danger" onclick="hoteles.splice(${index}, 1); updateList();">Eliminar</button>
          </div>
          <input type="text" class="form-control mb-2" placeholder="Nombre" value="${hotel.Nombre || ''}" 
                 onchange="hoteles[${index}].Nombre = this.value;">
          <input type="text" class="form-control mb-2" placeholder="Imagen (URL)" value="${hotel.Imagen || ''}" 
                 onchange="hoteles[${index}].Imagen = this.value;">
          <input type="text" class="form-control mb-2" placeholder="Web" value="${hotel.Web || ''}" 
                 onchange="hoteles[${index}].Web = this.value;">
          <textarea class="form-control mb-2" placeholder="Anotaciones">${hotel.Anotaciones || ''}</textarea>
          <input type="text" class="form-control mb-2" placeholder="Estrellas" value="${hotel.Estrellas || ''}" 
                 onchange="hoteles[${index}].Estrellas = this.value;">
          <input type="text" class="form-control mb-2" placeholder="Descuento" value="${hotel.Descuento || ''}" 
                 onchange="hoteles[${index}].Descuento = this.value;">
          <input type="text" class="form-control mb-2" placeholder="Distancia (metros)" value="${hotel.Distancia_metros || ''}" 
                 onchange="hoteles[${index}].Distancia_metros = this.value;">
          <input type="text" class="form-control" placeholder="Distancia (tiempo)" value="${hotel.Distancia_tiempo || ''}" 
                 onchange="hoteles[${index}].Distancia_tiempo = this.value;">
        </div>
      `).join('');
    };
    
    window.hoteles = hoteles;
    window.updateList = updateList;
    updateList();
    
    document.getElementById('hoteles-add-btn').addEventListener('click', () => {
      hoteles.push({
        id: Date.now().toString(),
        Nombre: '',
        Imagen: '',
        Web: '',
        Anotaciones: '',
        Estrellas: '',
        Descuento: '',
        Distancia_metros: '',
        Distancia_tiempo: ''
      });
      updateList();
    });
    
    document.getElementById('hoteles-save-btn').addEventListener('click', () => {
      localStorage.setItem('wedding-hoteles', JSON.stringify(hoteles));
      if (typeof cargarHoteles === 'function') {
        cargarHoteles();
      }
      setTimeout(() => {
        const section = document.getElementById('lista-hoteles');
        if (section) {
          const existingBtn = section.querySelector('.section-edit-data-btn');
          if (existingBtn) existingBtn.remove();
          this.addEditButtonsToSections();
        }
      }, 500);
      this.showNotification('Hoteles guardados correctamente', 'success');
      modal.remove();
      delete window.hoteles;
      delete window.updateList;
    });
    
    document.getElementById('hoteles-cancel-btn').addEventListener('click', () => {
      modal.remove();
      delete window.hoteles;
      delete window.updateList;
    });
  }

  openRegalosEditor() {
    const savedRegalos = localStorage.getItem('wedding-regalos');
    const regalos = savedRegalos ? JSON.parse(savedRegalos) : [];
    
    const modal = document.createElement('div');
    modal.className = 'text-edit-modal active';
    modal.style.zIndex = '10001';
    modal.innerHTML = `
      <div class="text-edit-modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
        <h4>Editar Regalos</h4>
        <div id="regalos-list-container"></div>
        <div class="text-edit-modal-actions mt-3">
          <button class="text-edit-btn text-edit-btn-secondary" id="regalos-add-btn">+ Añadir Regalo</button>
          <button class="text-edit-btn text-edit-btn-secondary" id="regalos-cancel-btn">Cancelar</button>
          <button class="text-edit-btn text-edit-btn-primary" id="regalos-save-btn">Guardar</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const container = document.getElementById('regalos-list-container');
    const updateList = () => {
      container.innerHTML = regalos.map((regalo, index) => `
        <div class="mb-3 p-3 border rounded">
          <div class="d-flex justify-content-between mb-2">
            <strong>Regalo ${index + 1}</strong>
            <button class="btn btn-sm btn-danger" onclick="regalos.splice(${index}, 1); updateRegalosList();">Eliminar</button>
          </div>
          <input type="text" class="form-control mb-2" placeholder="Sección" value="${regalo.Seccion || ''}" 
                 onchange="regalos[${index}].Seccion = this.value;">
          <input type="text" class="form-control mb-2" placeholder="Regalo (ID)" value="${regalo.Regalo || ''}" 
                 onchange="regalos[${index}].Regalo = this.value;">
          <input type="text" class="form-control mb-2" placeholder="Título" value="${regalo.titulo || ''}" 
                 onchange="regalos[${index}].titulo = this.value;">
          <textarea class="form-control mb-2" placeholder="Descripción">${regalo.descripcion || ''}</textarea>
          <input type="text" class="form-control mb-2" placeholder="Imagen (URL)" value="${regalo.imagen || ''}" 
                 onchange="regalos[${index}].imagen = this.value;">
          <input type="text" class="form-control mb-2" placeholder="Concepto" value="${regalo.concepto || ''}" 
                 onchange="regalos[${index}].concepto = this.value;">
          <input type="number" class="form-control mb-2" placeholder="Recaudado" value="${regalo.Recaudado || 0}" 
                 onchange="regalos[${index}].Recaudado = parseFloat(this.value) || 0;">
          <input type="number" class="form-control" placeholder="Coste Total" value="${regalo.Coste_Total || 0}" 
                 onchange="regalos[${index}].Coste_Total = parseFloat(this.value) || 0;">
        </div>
      `).join('');
    };
    
    window.regalos = regalos;
    window.updateRegalosList = updateList;
    updateList();
    
    document.getElementById('regalos-add-btn').addEventListener('click', () => {
      regalos.push({
        Seccion: '',
        Regalo: Date.now().toString(),
        titulo: '',
        descripcion: '',
        imagen: '',
        concepto: '',
        Recaudado: 0,
        Coste_Total: 0
      });
      updateList();
    });
    
    document.getElementById('regalos-save-btn').addEventListener('click', () => {
      localStorage.setItem('wedding-regalos', JSON.stringify(regalos));
      if (typeof cargarRegalos === 'function') {
        cargarRegalos();
      }
      setTimeout(() => {
        const section = document.getElementById('lista-novios');
        if (section) {
          const existingBtn = section.querySelector('.section-edit-data-btn');
          if (existingBtn) existingBtn.remove();
          this.addEditButtonsToSections();
        }
      }, 500);
      this.showNotification('Regalos guardados correctamente', 'success');
      modal.remove();
      delete window.regalos;
      delete window.updateRegalosList;
    });
    
    document.getElementById('regalos-cancel-btn').addEventListener('click', () => {
      modal.remove();
      delete window.regalos;
      delete window.updateRegalosList;
    });
  }

  getElementId(element) {
    if (element.id) return 'text_' + element.id;
    if (element.getAttribute('data-edit-id')) return element.getAttribute('data-edit-id');
    
    const path = [];
    let current = element;
    let depth = 0;
    
    while (current && current !== document.body && depth < 10) {
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(c => c.tagName === current.tagName);
        const index = siblings.indexOf(current);
        const selector = current.tagName.toLowerCase();
        const classList = current.className ? '.' + current.className.split(' ').join('.') : '';
        path.unshift(`${selector}${classList}:${index}`);
      }
      current = parent;
      depth++;
    }
    
    return 'text_' + path.join('_').substring(0, 50);
  }

  getImageId(imgElement) {
    if (imgElement.id) return 'img_' + imgElement.id;
    if (imgElement.getAttribute('data-edit-image-id')) return imgElement.getAttribute('data-edit-image-id');
    
    const path = [];
    let current = imgElement;
    let depth = 0;
    
    while (current && current !== document.body && depth < 10) {
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(c => c.tagName === current.tagName);
        const index = siblings.indexOf(current);
        path.unshift(`${current.tagName.toLowerCase()}:${index}`);
      }
      current = parent;
      depth++;
    }
    
    return 'img_' + path.join('_').substring(0, 50);
  }

  loadSavedConfig() {
    const savedConfig = localStorage.getItem('wedding-content-config');
    if (!savedConfig) return;
    
    try {
      const config = JSON.parse(savedConfig);
      if (config.sections) {
        this.sections = config.sections;
      }
      
      // Aplicar visibilidad
      this.sections.forEach(section => {
        const sectionEl = document.getElementById(section.id);
        if (sectionEl) {
          sectionEl.style.display = section.visible ? '' : 'none';
        }
      });
      
      // Reordenar
      this.reorderSectionsInDOM();
      
      // Cargar textos guardados
      const savedTexts = JSON.parse(localStorage.getItem('wedding-content-texts') || '{}');
      Object.keys(savedTexts).forEach(editId => {
        const element = document.querySelector(`[data-edit-id="${editId}"]`);
        if (element) {
          element.textContent = savedTexts[editId];
        }
      });
      
      // Cargar imágenes guardadas
      const savedImages = JSON.parse(localStorage.getItem('wedding-content-images') || '{}');
      Object.keys(savedImages).forEach(imageId => {
        const element = document.querySelector(`[data-edit-image-id="${imageId}"]`);
        if (element && savedImages[imageId]) {
          if (savedImages[imageId].src) {
            element.src = savedImages[imageId].src;
          }
          if (savedImages[imageId].alt !== undefined) {
            element.alt = savedImages[imageId].alt;
          }
        }
      });
    } catch (e) {
      console.error('Error loading saved config:', e);
    }
  }

  saveConfig() {
    const config = {
      sections: this.sections
    };
    localStorage.setItem('wedding-content-config', JSON.stringify(config));
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--bs-success)' : type === 'info' ? 'var(--bs-info)' : 'var(--bs-primary)'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10001;
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ContentEditor();
  });
} else {
  new ContentEditor();
}
