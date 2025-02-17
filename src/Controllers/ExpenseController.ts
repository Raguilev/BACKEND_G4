import express, {Request, Response} from "express"

const ExpenseController = () =>{
    const path : string = "/expenses"
    const router = express.Router()

    router.get("/", (req : Request, resp : Response ) => {
        resp.json({
            msg : "",
            expenses : [
                {
                    id: 1,
                    date: "2024-12-12",
                    category: "Ocio",
                    description: "Libro de Stephen King",
                    recurring: false,
                    amount: 29.99,
                    user_id: 1
                  },
                  {
                    id: 2,
                    date: "2024-12-02",
                    category: "Servicios",
                    description: "Servicio de luz",
                    recurring: true,
                    amount: 229.99,
                    user_id: 1
                  }
            ]
        })
    })

    return [ path, router ]

}
export default ExpenseController