import express from "express"
import { deleteMenu, getAllMenus, updateMenu } from "../controllers/menuController"
import { createMenu } from "../controllers/menuController"
import { verifyAddMenu, verifyEditMenu } from "../middlewares/verifyMenu"
import uploadFile from "../middlewares/menuUpload"
import { verifyRole, verifyToken } from "../middlewares/authorization"

const app = express()
app.use(express.json())

app.get(`/`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getAllMenus)
app.post(`/`, [verifyToken, verifyRole(["MANAGER"]), uploadFile.single("picture"), verifyAddMenu], createMenu)
app.put(`/:id`, [verifyToken, verifyRole(["MANAGER"]), uploadFile.single("picture"), verifyEditMenu], updateMenu)
app.delete(`/:id`, [verifyToken, verifyRole(["MANAGER"])], deleteMenu)

export default app 