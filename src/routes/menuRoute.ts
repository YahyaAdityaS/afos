import express from "express"
import { changePicture, deleteMenu, getAllMenus, updateMenu } from "../controllers/menuController"
import { createMenu } from "../controllers/menuController"
import { verifyAddMenu, verifyEditMenu } from "../middlewares/verifyMenu"
import uploadFile from "../middlewares/menuUpload"
import { verifyRole, verifyToken } from "../middlewares/authorization"

const app = express()
app.use(express.json())

app.get(`/`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getAllMenus)
app.post(`/`, [verifyToken, verifyRole(["MANAGER"]), verifyAddMenu], createMenu)
app.put(`/:id`, [verifyToken, verifyRole(["MANAGER"]), verifyEditMenu], updateMenu)
app.put(`/pic/:id`, [verifyToken, verifyRole(["MANAGER"]), uploadFile.single("profile_picture")], changePicture)
app.delete(`/:id`, [verifyToken, verifyRole(["MANAGER"])], deleteMenu)

export default app 