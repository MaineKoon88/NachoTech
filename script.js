// =============================================
// FUNCIONES BÁSICAS DE MODALES Y SCROLL
// =============================================

/**
 * Desplaza suavemente a una sección de la página
 * @param {string} sectionId - ID de la sección a la que desplazarse
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

/**
 * Abre un modal específico
 * @param {string} modalId - ID del modal a abrir
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Ocultar scrollbar del body y compensar el ancho
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${getScrollbarWidth()}px`;
        
        // Mostrar el modal con animación
        modal.style.display = 'block';
        modal.style.animation = 'fadeIn 0.3s ease-out';
        
        // Enfocar el primer elemento interactivo
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}



/**
 * Cierra un modal específico
 * @param {string} modalId - ID del modal a cerrar
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Animación de salida
        modal.style.animation = 'fadeOut 0.2s ease-out';
        
        // Esperar a que termine la animación para ocultar
        setTimeout(() => {
            modal.style.display = 'none';
            
            // Restaurar el scroll del body
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
        }, 200);
    }
}

/**
 * Abre un modal cerrando primero otro (para modales anidados)
 * @param {string} modalToOpen - ID del modal a abrir
 * @param {string} modalToClose - ID del modal a cerrar
 */
function openNestedModal(modalToOpen, modalToClose) {
    closeModal(modalToClose);
    setTimeout(() => {
        openModal(modalToOpen);
    }, 250); // Retraso para mejor transición visual
}

// NUEVA FUNCIÓN PARA ÉPOCAS
function openEraModal(era) {
    openModal(`modal-${era}`);
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    // [Tus otros listeners...]
    
    // Cards de evolución
    document.querySelectorAll('.evolution-card').forEach(card => {
        card.addEventListener('click', function() {
            const eraMatch = this.className.match(/card-(90s|2000s|2010s|2020s)/);
            if (eraMatch) openEraModal(eraMatch[1]);
        });
    });

    // Botones en modales
    document.querySelectorAll('.modal-content a.btn').forEach(btn => {
        btn.addEventListener('click', e => e.stopPropagation());
    });
});
// =============================================
// FUNCIONES DE UTILIDAD
// =============================================

/**
 * Calcula el ancho de la barra de desplazamiento
 * @returns {number} Ancho de la barra de desplazamiento
 */
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * Configura los modales de periféricos con interacciones mejoradas
 */
function setupPeripheralModals() {
    const peripheralOptions = document.querySelectorAll('.peripheral-option');
    
    peripheralOptions.forEach(option => {
        // Estilo cursor pointer
        option.style.cursor = 'pointer';
        
        // Efecto al presionar
        option.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
        
        // Efecto al soltar
        option.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        // Resetear si el mouse sale
        option.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        // Manejar clic
        option.addEventListener('click', function(e) {
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                openNestedModal(modalId, 'peripherals-modal');
            }
        });
    });
}

// =============================================
// EVENT LISTENERS GLOBALES
// =============================================

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style="display: block;"]');
        openModals.forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// =============================================
// BOTÓN "VOLVER ARRIBA"
// =============================================

const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =============================================
// SCROLL SUAVE PARA ENLACES INTERNOS
// =============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// =============================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Configurar modales de periféricos
    setupPeripheralModals();
    
    // Resaltar sección actual en navegación
    const sections = document.querySelectorAll('.component-section');
    const navButtons = document.querySelectorAll('.component-btn');
    
    function setActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navButtons.forEach(btn => btn.classList.remove('active'));
                if (navButtons[index]) {
                    navButtons[index].classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', setActiveSection);
    setActiveSection(); // Ejecutar al cargar
});

// =============================================
// ANIMACIONES CSS (se pueden mover a CSS)
// =============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
    }
`;
document.head.appendChild(style);