import * as THREE from '../../../lib/three.module.js'
import PARAM from './shape.line.param.js'

export default class{
    constructor({group, count, position}){
        this.init()
        this.create(count, position)
        this.add(group)
    }


    // init
    init(){
    }


    // add
    add(group){
        group.add(this.local)
    }


    // create
    create(count, position){
        this.local = new THREE.Group()

        for(let i = 0; i < count; i++){
            const index = i * 3
            const x = position[index]
            const y = position[index + 1]
            const z = position[index + 2]

            const mesh = this.createMesh({x, y, z})
            mesh.layers.set(PARAM.layers)

            this.local.add(mesh)
        }
    }
    createMesh(position){
        const geometry = this.createGeometry(position)
        const material = this.createMaterial()
        return new THREE.LineSegments(geometry, material)
    }
    createGeometry({x, y, z}){
        const geometry = new THREE.BufferGeometry()

        const position = new Float32Array([0, 0, 0, x, y, z]) 

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
        
        return geometry
    }
    createMaterial(){
        return new THREE.LineBasicMaterial({
            color: PARAM.color,
            transparent: true,
            opacity: PARAM.opacity,
            depthTest: false
        })
    }


    // animate
    animate({angle}){
        const time = window.performance.now()

        this.local.rotation.y += 0.008

        this.local.children.forEach((mesh, i) => {
            const {geometry} = mesh
            const {position} = geometry.attributes
            const {array} = position
            const {pi, theta, radius} = angle[i]

            const n1 = SIMPLEX.noise2D(pi / 80, time * 0.001) * PARAM.pi
            const n2 = SIMPLEX.noise2D(theta / 90, time * 0.001) * PARAM.theta
            const n3 = SIMPLEX.noise2D(radius / 100, time * 0.001) * PARAM.radius

            const nPi = pi + n1
            const nTheta = theta + n2
            const nRadius = radius - n3

            const {x, y, z} = METHOD.getSpherePosition(nPi, nTheta, nRadius)

            array[3] = x
            array[4] = y
            array[5] = z

            position.needsUpdate = true
        })
    }
}