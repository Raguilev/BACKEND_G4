import express, {Express,Request,Response} from 'express'
import dotenv from 'dotenv' //para lo del puerto
import bodyParser from 'body-parser' // para post
import cors from 'cors'

dotenv.config() //para que tome el puerto

const app:Express = express()
app.use(bodyParser.json()) //para post
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('assets'))
app.use(cors())

const port = process.env.PORT || 3000 //en caso de que no haya puerto, se pone el 3003

app.listen(port, () => {
    console.log(`Server ejecutandose en puerto: ${port}`)
})