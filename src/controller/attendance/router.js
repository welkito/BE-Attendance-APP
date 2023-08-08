import { Router } from "express"
import { verifyUser ,verifyAdmin,verifyEmployee} from "../../middleware/token.verify.js"

//@for image handlers
// import { createCloudinaryStorage,createUploader } from "../../helper/uploader.js"
// const storage = createCloudinaryStorage("Public/CashierProfiles")
// const uploader = createUploader(storage)

// @import the controller
import * as AttendanceControllers from "./index.js"

// @define routes
const router = Router()

//routes for authentication
router.get("/", verifyEmployee, AttendanceControllers.showAttendances)//
router.get("/clockIn", verifyEmployee, AttendanceControllers.clockIn)//
router.post("/clockOut",verifyEmployee, AttendanceControllers.clockOut)//

export default router