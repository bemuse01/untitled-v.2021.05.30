export default {
    createPositions({count, size}){
        const position = [], angle = []
        size = size * 0.6

        for(let i = 0; i < count; i++){
            const pi = Math.random() * 180
            const theta = Math.random() * 360
            const radius = size - Math.random() * size * 0.4
            const {x, y, z} = METHOD.getSpherePosition(pi, theta, radius)

            angle.push({pi, theta, radius})
            position.push(x, y, z)
        }

        return {position, angle}
    }
}