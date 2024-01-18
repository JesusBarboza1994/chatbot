import app from './src/app.js'
import dotenv from 'dotenv'


const puerto = process.env.PORT

app.listen(puerto, () => {
        console.log(`API REST corriendo en http://localhost:${puerto}`)
})

          