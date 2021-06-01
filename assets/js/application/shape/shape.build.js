import * as THREE from '../../lib/three.module.js'
import {EffectComposer} from '../../postprocess/EffectComposer.js'
import {RenderPass} from '../../postprocess/RenderPass.js'
import {BloomPass} from '../../postprocess/BloomPass.js'
import {FilmPass} from '../../postprocess/FilmPass.js'
import SHAPE_METHOD from './shape.method.js'
import LINE from './line/shape.line.build.js'
import POINT from './point/shape.point.build.js'

export default class{
    constructor(app){
        this.init(app)
        this.create()
        this.add()
    }


    // init
    init(app){
        this.param = {
            fov: 60,
            near: 0.1,
            far: 10000,
            pos: 1000
        }

        this.modules = {
            line: LINE,
            point: POINT
        }

        this.initGroup()
        this.initRenderObject()
        this.initComposer(app)
        this.initPublicVar()
    }
    initPublicVar(){
        this.count = 400

        const {position, angle} = SHAPE_METHOD.createPositions({count: this.count, size: this.size.obj.w / 2})
        this.position = position
        this.angle = angle
    }
    initGroup(){
        this.group = {}
        this.comp = {}

        for(const module in this.modules){
            this.group[module] = new THREE.Group()
            this.comp[module] = null
        }

        this.build = new THREE.Group()
    }
    initRenderObject(){
        this.element = document.querySelector('.shape-object')

        const {width, height} = this.element.getBoundingClientRect()

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(this.param.fov, width / height, this.param.near, this.param.far)
        this.camera.position.z = this.param.pos
        
        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: METHOD.getVisibleWidth(this.camera, 0),
                h: METHOD.getVisibleHeight(this.camera, 0)
            }
        }
    }
    initComposer(app){
        const {width, height, renderer} = app

        this.composer = new EffectComposer(renderer)
        this.composer.setSize(width, height)

        const renderScene = new RenderPass(this.scene, this.camera)

        const filmPass = new FilmPass(0, 0, 0, false)

        const bloomPass = new BloomPass(this.param.bloom)

        this.composer.addPass(renderScene)
        this.composer.addPass(bloomPass)
        this.composer.addPass(filmPass)
    }


    // add
    add(){
        for(let i in this.group) this.build.add(this.group[i])
        
        this.scene.add(this.build)
    }


    // create
    create(){
        for(const module in this.modules){
            const instance = this.modules[module]
            const group = this.group[module]

            this.comp[module] = new instance({group, count: this.count, position: this.position})
        }
    }


    // animate
    animate({app}){
        this.render(app)
        this.animateObject()
    }
    render(app){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top
        const left = rect.left
        const bottom = app.renderer.domElement.clientHeight - rect.bottom

        app.renderer.setScissor(left, bottom, width, height)
        app.renderer.setViewport(left, bottom, width, height)

        app.renderer.autoClear = false
        
        app.renderer.clear()
        this.camera.layers.set(PROCESS)
        this.composer.render()

        app.renderer.clearDepth()
        this.camera.layers.set(NORMAL)
        app.renderer.render(this.scene, this.camera)
    }
    animateObject(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].animate) continue
            this.comp[i].animate({angle: this.angle})
        }
    }


    // resize
    resize(){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: METHOD.getVisibleWidth(this.camera, 0),
                h: METHOD.getVisibleHeight(this.camera, 0)
            }
        }

        this.resizeObject()
    }
    resizeObject(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].resize) continue
            this.comp[i].resize(this.size)
        }
    }
}