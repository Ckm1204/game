import * as THREE from 'three'
import * as CANNON from 'cannon-es'
export default class Fox {
constructor(experience, robot) {
    this.experience = experience
    this.robot = robot // 👈 almacenar referencia al robot
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.setPhysics()

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.foxModel

        this.setModel()
        this.setAnimation()
    }
setPhysics() {
    const shape = new CANNON.Sphere(0.3)

this.body = new CANNON.Body({
    mass: 1, // 👈 importante, que no sea 0
    shape,
position: new CANNON.Vec3(10, 1, -10),

    linearDamping: 0.1,   // opcional
    angularDamping: 0.9   // opcional
})


    this.body.collisionFilterGroup = 1
    this.body.collisionFilterMask = 1

    this.experience.physics.world.addBody(this.body)
}
    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(0.02, 0.02, 0.02)
        this.model.position.set(3, 0, 0)
        this.scene.add(this.model)
        //Activando la sobra de fox
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
            }
        })
    }
    //Manejo GUI
    setAnimation() {
        this.animation = {}

        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        // Actions
        this.animation.actions = {}

        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) => {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        // Debug
        if (this.debug.active) {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

update() {
    this.animation.mixer.update(this.time.delta * 0.001)

    if (this.body && this.robot?.body) {
        const foxPos = this.body.position
        const robotPos = this.robot.body.position

        const direction = new THREE.Vector3(
            robotPos.x - foxPos.x,
            0,
            robotPos.z - foxPos.z
        ).normalize()

        const speed = 2 // puedes ajustar velocidad

        // Aplicar movimiento
   const force = new CANNON.Vec3(
    direction.x * speed,
    0,
    direction.z * speed
)
this.body.applyForce(force, this.body.position)

        // Animación
        if (this.animation.actions.current !== this.animation.actions.running) {
            this.animation.play('running')
        }

        // Rotar el modelo visual hacia el robot (opcional)
        const angle = Math.atan2(direction.x, direction.z)
        this.model.rotation.y = angle
    }

    if (this.body) {
        this.model.position.copy(this.body.position)
    }
}
 
}
