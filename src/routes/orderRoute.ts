import express from "express"
import { getAllOrders, createOrder, updateStatusOrder, deleteOrder } from "../controllers/orderController"
import { verifyAddOrder, verifyEditStatus } from "../middlewares/orderValidation"
import { verifyRole, verifyToken } from "../middlewares/authorization"
import uploadFile from "../middlewares/userUpload";

const app = express()
app.use(express.json())
app.get(`/`, [verifyToken, verifyRole(["CASHIER","MANAGER"])], getAllOrders)
app.post(`/`, [verifyToken, verifyRole(["CASHIER"]),uploadFile.single("picture"), verifyAddOrder], createOrder)
app.put(`/:id`, [verifyToken, verifyRole(["CASHIER"]), verifyEditStatus], updateStatusOrder)
app.delete(`/:id`, [verifyToken, verifyRole(["MANAGER"])], deleteOrder)


export default app