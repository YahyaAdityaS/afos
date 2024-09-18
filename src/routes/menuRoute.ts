import express from "express"
import { getAllMenus } from "../controllers/menuController"

const app = express()
app.use(express.json())

app.get('/', getAllMenus)

export default app 