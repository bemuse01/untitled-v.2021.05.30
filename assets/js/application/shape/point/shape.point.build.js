import * as THREE from '../../../lib/three.module.js'
import LINE_PARAM from '../line/shape.line.param.js'

export default class{
    constructor({group, count, position}){
        this.init(count, position)
        this.create()
        this.add(group)
    }


    // init
    init(count, position){
        this.param = {
            color: 0x4fffd1,
            opacity: 1.0,
            size: 3.0,
            layers: PROCESS
        }

        this.count = count
        this.pos = position
    }


    // add
    add(group){
        group.add(this.mesh)
    }


    // create
    create(){
        this.createMesh()
    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial()
        this.mesh = new THREE.Points(geometry, material)
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const position = new Float32Array(this.pos)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
        
        return geometry
    }
    createMaterial(){
        return new THREE.PointsMaterial({
            color: this.param.color,
            transparent: true,
            opacity: this.param.opacity,
            size: this.param.size
        })
    }


    // animate
    animate({angle}){
        const time = window.performance.now()

        const {geometry} = this.mesh
        const {position} = geometry.attributes
        const {array} = position

        this.mesh.rotation.y += 0.008

        for(let i = 0; i < array.length / 3; i++){
            const index = i * 3
            const {pi, theta, radius} = angle[i]

            const n1 = SIMPLEX.noise2D(pi / 80, time * 0.001) * LINE_PARAM.pi
            const n2 = SIMPLEX.noise2D(theta / 90, time * 0.001) * LINE_PARAM.theta
            const n3 = SIMPLEX.noise2D(radius / 100, time * 0.001) * LINE_PARAM.radius

            const nPi = pi + n1
            const nTheta = theta + n2
            const nRadius = radius - n3

            const {x, y, z} = METHOD.getSpherePosition(nPi, nTheta, nRadius)

            array[index] = x
            array[index + 1] = y
            array[index + 2] = z
        }

        position.needsUpdate = true
    }
}