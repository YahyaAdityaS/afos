import express from "express"
import { getAllMenus, updateMenu } from "../controllers/menuController"
import {createMenu} from "../controllers/menuController"
import { verifyAddMenu, verifyEditMenu } from "../middlewares/verifyMenu"

const app = express()
app.use(express.json())

app.get('/', getAllMenus)
app.post(`/`,[verifyAddMenu], createMenu)
app.put(`/:id`, [verifyEditMenu], updateMenu)

export default app 