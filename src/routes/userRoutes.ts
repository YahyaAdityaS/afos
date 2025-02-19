import  express  from "express";
import { authentication, createUser, deleteUser, getAllUser, updateUser, getProfile } from "../controllers/userController";
import { verifyAuthentication, verifyAddUser, verifyEditUser } from "../middlewares/userValidation";
import { verify } from "crypto";
import { changePicture } from "../controllers/userController";
import uploadFile from "../middlewares/userUpload";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.get(`/`, getAllUser)
app.get(`/profile`, verifyToken, getProfile)
app.post(`/create`, [uploadFile.single("picture"), verifyAddUser], createUser)
app.put(`/:id`,[uploadFile.single("picture"), verifyEditUser], updateUser)
app.post(`/login`,[verifyAuthentication], authentication)
app.put(`/picture/:id`,[uploadFile.single("picture")], changePicture)
app.delete(`/:id`, deleteUser)

export default app 