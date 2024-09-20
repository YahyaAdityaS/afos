import express from "express"
import { getAllMenus } from "../controllers/menuController"
import {createMenu} from "../controllers/menuController"
import { verifyAddMenu } from "../middlewares/verifyMenu"

const app = express()
app.use(express.json())

app.get('/', getAllMenus)
app.post(`/`,[verifyAddMenu], createMenu)

export default app 