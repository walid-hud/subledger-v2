import User from "../models/User.model.js"



export async function getUsers(){
    const users = await User.find()
    return users
}