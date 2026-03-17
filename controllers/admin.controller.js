import { getUsers } from "../services/admin.service.js"
import { sendResponse } from "../utils/response.js"


 async function GetUsers(req,res){
    const users  = await getUsers()
    sendResponse(res , 200 , users ) 

}



export default {GetUsers}