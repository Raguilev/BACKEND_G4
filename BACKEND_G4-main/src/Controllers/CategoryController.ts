import express, { Request, Response } from "express"
const db = require("../DAO/models")

const CategoriaController = () => {
    const path = "/category"

    const router = express.Router()

    router.get("/", async (req : Request, resp : Response) => {
        const category = await db.Category.findAll()
        resp.json({
            msg : "",
            categorias : category
        }) 
    })

    return [ path, router ]
}

export default CategoriaController