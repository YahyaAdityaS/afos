import express from "express"
import { getAllMenus } from "../controllers/menuController"
import {createMenu} from "../controllers/menuController"

const app = express()
app.use(express.json())

app.get('/', getAllMenus)
app.post(`/`, createMenu)

export default app 