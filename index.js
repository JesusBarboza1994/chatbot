'use sctrict'

if (process.env.NODE_ENV !== "production") {
        require("dotenv").config();
}

const app = require('./src/app')
const puerto = process.env.PORT

app.listen(puerto, () => {
        console.log(`API REST corriendo en http://localhost:${puerto}`)
})

          