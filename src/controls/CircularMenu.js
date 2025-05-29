import gsap from 'gsap'

export default class CircularMenu {
  constructor({ container, vrIntegration, onAudioToggle, onWalkMode, onFullscreen, onCancelGame }) {
    this.container = container
    this.vrIntegration = vrIntegration
    this.isOpen = false
    this.actionButtons = []

    const baseStyle = `
      position: fixed;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 255, 0, 0.1);
      color: #ffe600;
      font-size: 20px;
      border: 1px solid rgba(255, 255, 0, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px #ffe600;
      backdrop-filter: blur(4px);
      z-index: 9999;
      transition: all 0.3s ease;
    `

    const hoverStyle = `
      background: rgba(255, 255, 0, 0.25);
      box-shadow: 0 0 15px #ffe600, 0 0 30px #ffe600;
      transform: scale(1.1);
    `

    this.toggleButton = document.createElement('button')
    this.toggleButton.innerText = '⚙️'
    this.toggleButton.title = 'Mostrar menú'
    this.toggleButton.setAttribute('aria-label', 'Mostrar menú')
    this.toggleButton.style.cssText = baseStyle + 'top: 80px; right: 20px;'
    container.appendChild(this.toggleButton)
    this.toggleButton.style.display = 'none'
    this.toggleButton.addEventListener('click', () => this.toggleMenu())

    const actions = [
      { icon: '🔊', title: 'Audio', onClick: onAudioToggle },
      { icon: '🚶', title: 'Modo Caminata', onClick: onWalkMode },
      { icon: '🖥️', title: 'Pantalla Completa', onClick: onFullscreen },
      { icon: '🥽', title: 'Modo VR', onClick: () => this.vrIntegration.toggleVR() },
      { icon: '👨‍💻', title: 'Acerca de', onClick: () => this.showAboutModal() },
      { icon: '❌', title: 'Cancelar Juego', onClick: onCancelGame }
    ]

    actions.forEach((action, index) => {
      const btn = document.createElement('button')
      btn.innerText = action.icon
      btn.title = action.title
      btn.setAttribute('aria-label', action.title)

      Object.assign(btn.style, {
        position: 'fixed',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 0, 0.1)',
        color: '#ffe600',
        fontSize: '20px',
        border: '1px solid rgba(255, 255, 0, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 10px #ffe600',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        top: `${140 + index * 60}px`,
        right: '20px',
        opacity: '0',
        pointerEvents: 'none'
      })

      btn.addEventListener('click', () => {
        action.onClick()
        this.toggleMenu()
      })

      btn.addEventListener('mouseenter', () => btn.style.cssText += hoverStyle)
      btn.addEventListener('mouseleave', () => btn.style.cssText = btn.style.cssText.replace(hoverStyle, ''))

      this.container.appendChild(btn)
      this.actionButtons.push(btn)
    })

    this.timer = document.createElement('div')
    this.timer.id = 'hud-timer'
    this.timer.innerText = '⏱ 0s'
    Object.assign(this.timer.style, {
      position: 'fixed',
      top: '16px',
      left: '70px',
      fontSize: '16px',
      fontWeight: 'bold',
      background: 'rgba(0,0,0,0.6)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '8px',
      zIndex: 9999,
      fontFamily: 'monospace',
      pointerEvents: 'none'
    })
    document.body.appendChild(this.timer)

    this.status = document.createElement('div')
    this.status.id = 'hud-points'
    this.status.innerText = '🎖️ Puntos: 1'
    Object.assign(this.status.style, {
      position: 'fixed',
      top: '16px',
      left: '1000px',
      fontSize: '16px',
      fontWeight: 'bold',
      background: 'rgba(255, 255, 0, 0.1)',
      color: '#ffe600',
      padding: '6px 12px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 0, 0.4)',
      boxShadow: '0 0 12px rgba(255, 255, 0, 0.2)',
      fontFamily: "'Orbitron', sans-serif",
      zIndex: 9999,
      pointerEvents: 'none',
      transition: 'all 0.3s ease'
    })
    document.body.appendChild(this.status)

    this.playersLabel = document.createElement('div')
    this.playersLabel.id = 'hud-players'
    this.playersLabel.innerText = '👥 Jugadores: 1'
    Object.assign(this.playersLabel.style, {
      position: 'fixed',
      top: '16px',
      left: '140px',
      fontSize: '16px',
      fontWeight: 'bold',
      background: 'rgba(0,0,0,0.6)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '8px',
      zIndex: 9999,
      fontFamily: 'monospace',
      pointerEvents: 'none'
    })
    document.body.appendChild(this.playersLabel)
  }

  showAboutModal() {
    if (this.aboutContainer) return

    this.aboutContainer = document.createElement('div')
    Object.assign(this.aboutContainer.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '24px 32px',
      borderRadius: '20px',
      color: '#fff',
      zIndex: '10000',
      textAlign: 'center',
      fontFamily: "'Orbitron', sans-serif",
      maxWidth: '320px',
      width: '90%',
      background: 'rgba(255, 255, 255, 0.06)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 0 24px rgba(255, 255, 0, 0.3), inset 0 0 12px rgba(255, 255, 0, 0.1)',
      animation: 'fadeInScale 0.6s ease-out'
    })

    this.aboutContainer.innerHTML = `
      <h2 style="margin-bottom: 10px;">👨‍💻 Desarrollador</h2>
      <p>SantiiBoop Y el tello</p>
      <p style="font-size: 14px;">Universidad Cooperativa de Colombia</p>
      <p style="font-size: 13px;">Proyecto interactivo educativo con Three.js</p>
      <p style="font-size: 13px;">guswillsan@gmail.com</p>
      <button style="margin-top: 12px; padding: 6px 14px; font-size: 14px; background: #00fff7; color: black; border: none; border-radius: 6px; cursor: pointer;">Cerrar</button>`

    const closeBtn = this.aboutContainer.querySelector('button')
    closeBtn.onclick = () => {
      this.aboutContainer.remove()
      this.aboutContainer = null
    }

    document.body.appendChild(this.aboutContainer)
  }

  toggleMenu() {
    this.isOpen = !this.isOpen
    this.actionButtons.forEach((btn, index) => {
      const delay = index * 0.05
      gsap.to(btn, {
        opacity: this.isOpen ? 1 : 0,
        y: this.isOpen ? 0 : -10,
        pointerEvents: this.isOpen ? 'auto' : 'none',
        delay,
        duration: this.isOpen ? 0.3 : 0.2,
        ease: this.isOpen ? 'power2.out' : 'power2.in'
      })
    })
  }

  setStatus(text) {
    if (this.status) {
      this.status.innerText = text
      gsap.fromTo(this.status, { scale: 1.2, opacity: 0.7 }, { scale: 1, opacity: 1, duration: 0.3 })
    }
  }

  setTimer(seconds) {
    if (this.timer) this.timer.innerText = `⏱ ${seconds}s`
  }

  setPlayerCount(count) {
    if (this.playersLabel) {
      this.playersLabel.innerText = `👥 Jugadores: ${count}`
    }
  }

  destroy() {
    this.toggleButton?.remove()
    this.actionButtons?.forEach(btn => btn.remove())
    this.timer?.remove()
    this.status?.remove()
    this.playersLabel?.remove()
  }
}
