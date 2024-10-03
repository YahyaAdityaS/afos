import express from "express"
import { changePicture, deleteMenu, getAllMenus, updateMenu } from "../controllers/menuController"
import {createMenu} from "../controllers/menuController"
import { verifyAddMenu, verifyEditMenu } from "../middlewares/verifyMenu"
import uploadFile from "../middlewares/menuUpload"

const app = express()
app.use(express.json())

app.get('/', getAllMenus)
app.post(`/`,[verifyAddMenu], createMenu)
app.put(`/:id`, [verifyEditMenu], updateMenu)
app.put(`/pic/:id`, [uploadFile.single("profile_picture")],changePicture)
app.delete(`/:id`, deleteMenu)

export default app 