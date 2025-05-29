// PowerUpStar.js
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { gsap } from 'gsap'

export default class PowerUpStar {
  constructor(experience, position = new THREE.Vector3(-25, 1.5, 30)) {
    this.experience = experience
    this.scene = experience.scene
    this.physics = experience.physics
    this.robot = experience.world.robot
    this.collected = false

    // Visual: estrella
    const geometry = new THREE.IcosahedronGeometry(0.5, 1)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffcc00,
      emissiveIntensity: 1,
    })
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.copy(position)
    this.mesh.castShadow = true
    this.scene.add(this.mesh)

    // Glow pulsante
    gsap.to(this.mesh.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })

    // Physics
    const shape = new CANNON.Sphere(0.5)
    this.body = new CANNON.Body({
      mass: 0,
      shape,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      collisionFilterGroup: 2,
      collisionFilterMask: 1,
    })
    this.body.userData = { isPowerUp: true }
    this.physics.world.addBody(this.body)

    // Faro visual giratorio
    this.faroGroup = new THREE.Group()
    this.scene.add(this.faroGroup)

    const rayMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    })

    const rayCount = 6
    for (let i = 0; i < rayCount; i++) {
      const cone = new THREE.ConeGeometry(0.2, 4, 6, 1, true)
      const ray = new THREE.Mesh(cone, rayMaterial)

      ray.position.set(0, 2, 0)
      ray.rotation.x = Math.PI / 2
      ray.rotation.z = (i * Math.PI * 2) / rayCount

      this.faroGroup.add(ray)
    }
    this.faroGroup.position.copy(position)
  }

  update() {
    if (!this.robot || !this.robot.body) {
  this.scene.remove(this.mesh)
  this.physics.world.removeBody(this.body)
  return
}
    if (this.mesh && this.body) {
      this.mesh.position.copy(this.body.position)
    }

    // Giro del faro
    this.faroGroup.rotation.y += 0.5 * this.experience.time.delta * 0.001

    // Recolección
    const distance = this.robot.body.position.distanceTo(this.body.position)
    if (distance < 1 && !this.collected) {
      this.collect()
    }
    
  }

  collect() {
    if (this.collected) return
    this.collected = true

    this.scene.remove(this.mesh)
    this.scene.remove(this.faroGroup)
    this.physics.world.removeBody(this.body)

    this.robot.canShoot = true
    console.log('⭐ Robot ahora puede disparar')
  }
}
