import { Router } from "express"
import { verifyUser ,verifyAdmin,verifyEmployee} from "../../middleware/token.verify.js"

//@for image handlers
// import { createCloudinaryStorage,createUploader } from "../../helper/uploader.js"
// const storage = createCloudinaryStorage("Public/CashierProfiles")
// const uploader = createUploader(storage)

// @import the controller
import * as AuthControllers from "./index.js"

// @define routes
const router = Router()

//routes for authentication
router.get("/users", AuthControllers.showAll)//
router.post("/login", AuthControllers.login)//
router.get("/", verifyUser, AuthControllers.keepLogin)//
router.post("/register", verifyAdmin,AuthControllers.register)//
router.patch("/update", verifyEmployee, AuthControllers.update)//verify user

export default router