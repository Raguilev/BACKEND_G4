import express, {Express,Router} from 'express'
import dotenv from 'dotenv' //para lo del puerto
import bodyParser from 'body-parser' // para post
import cors from 'cors'
import ExpenseController from './Controllers/ExpenseController'
import UserController from './Controllers/UserController'
import AccessLogController from './Controllers/AccessLogController'
import CategoriaController from './Controllers/CategoryController'


dotenv.config() //para que tome el puerto

const app:Express = express()
app.use(bodyParser.json()) //para post
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('assets')) // Carpeta archivos estaticos
app.use(cors()) // TODO: Incrementar la seguridad

const port = process.env.PORT || 3000 //en caso de que no haya puerto, se pone el 3003

const [expensesPath, expensesRouter] = ExpenseController()
const [userPath, userRouter] = UserController()
const [accessLogsPath, accessLogsRouter] = AccessLogController();
const [categoryPath, categoryRouter] = CategoriaController();

app.use(expensesPath as string , expensesRouter as Router)
app.use(userPath as string , userRouter as Router)
app.use(accessLogsPath as string , accessLogsRouter as Router)
app.use(categoryPath as string , categoryRouter as Router)

app.listen(port, () => {
    console.log(`Server ejecutandose en puerto: ${port}`)
})