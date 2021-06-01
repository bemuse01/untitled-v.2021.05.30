import APP from '../application/app/app.build.js'
import SHAPE from '../application/shape/shape.build.js'

new Vue({
    el: '#wrap',
    data(){
        return{
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            this.initThree()
            this.animate()

            window.addEventListener('resize', this.onWindowResize, false)
        },


        // three
        initThree(){
            OBJECT.app = new APP()

            this.createObject(OBJECT.app)
        },
        resizeThree(){
            const {app} = OBJECT

            for(let i in OBJECT){
                if(!OBJECT[i].resize) continue
                OBJECT[i].resize({app})
            }
        },
        renderThree(){
            const {app} = OBJECT
            
            for(let i in OBJECT){
                if(!OBJECT[i].animate) continue
                OBJECT[i].animate({app})
            }
        },
        createObject(app){
            this.createShape(app)
        },
        createShape(app){
            OBJECT.shape = new SHAPE(app)
        },


        // event
        onWindowResize(){
            this.resizeThree()
        },


        // render
        render(){
            this.renderThree()
        },
        animate(){
            this.render()
            requestAnimationFrame(this.animate)
        }
    }
})