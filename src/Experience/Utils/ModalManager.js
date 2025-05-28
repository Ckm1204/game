export default class ModalManager {
  constructor({ container = document.body } = {}) {
    this.container = container
    this._createModal()
  }

  _createModal() {
    // Overlay con blur y sombra
    this.overlay = document.createElement('div')
    Object.assign(this.overlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    })
    this.container.appendChild(this.overlay)

    // Caja del modal con estilo futurista
    this.box = document.createElement('div')
    Object.assign(this.box.style, {
      background: 'rgba(255, 255, 255, 0.07)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      color: '#fff',
      padding: '28px 32px',
      borderRadius: '20px',
      maxWidth: '360px',
      width: '90%',
      textAlign: 'center',
      position: 'relative',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 0 20px rgba(255, 255, 0, 0.3), inset 0 0 12px rgba(255, 255, 255, 0.05)',
      fontFamily: "'Orbitron', sans-serif",
      animation: 'fadeInScale 0.5s ease-out'
    })
    this.overlay.appendChild(this.box)

    // Icono
    this.icon = document.createElement('div')
    Object.assign(this.icon.style, {
      fontSize: '36px',
      marginBottom: '16px',
      filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))'
    })
    this.box.appendChild(this.icon)

    // Mensaje
    this.text = document.createElement('div')
    Object.assign(this.text.style, {
      fontSize: '18px',
      marginBottom: '20px',
      whiteSpace: 'pre-line',
      lineHeight: '1.5',
      textShadow: '0 0 6px rgba(255, 255, 255, 0.15)'
    })
    this.box.appendChild(this.text)

    // Contenedor de botones
    this.buttonsContainer = document.createElement('div')
    Object.assign(this.buttonsContainer.style, {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '12px'
    })
    this.box.appendChild(this.buttonsContainer)

    // Botón de cerrar
    this.closeBtn = document.createElement('button')
    this.closeBtn.innerText = 'Cerrar'
    Object.assign(this.closeBtn.style, {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '12px',
      background: 'linear-gradient(90deg, #ffd700, #ffae00)',
      color: '#000',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontFamily: "'Orbitron', sans-serif",
      boxShadow: '0 0 12px rgba(255, 204, 0, 0.4)'
    })
    this.closeBtn.onclick = () => this.hide()
    this.box.appendChild(this.closeBtn)
  }

  show({ icon = 'ℹ️', message = '', buttons = [] } = {}) {
    this.icon.innerText = icon
    this.text.innerText = message
    this.overlay.style.display = 'flex'

    // Limpiar botones anteriores
    this.buttonsContainer.innerHTML = ''

    // Agregar botones personalizados si se proporcionan
    if (Array.isArray(buttons) && buttons.length > 0) {
      buttons.forEach(btn => {
        const button = document.createElement('button')
        button.innerText = btn.text || 'Aceptar'
        button.onclick = () => {
          btn.onClick?.()
          this.hide()
        }
        Object.assign(button.style, {
          padding: '12px',
          background: 'linear-gradient(90deg, #ffe600, #ffae00)',
          color: '#000',
          fontWeight: 'bold',
          fontFamily: "'Orbitron', sans-serif",
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(255, 200, 0, 0.5)',
          transition: 'transform 0.2s ease'
        })
        button.onmouseover = () => button.style.transform = 'scale(1.05)'
        button.onmouseout = () => button.style.transform = 'scale(1)'
        this.buttonsContainer.appendChild(button)
      })
      this.closeBtn.style.display = 'none'
    } else {
      this.closeBtn.style.display = 'inline-block'
    }
  }

  hide() {
    this.overlay.style.display = 'none'
  }
}
