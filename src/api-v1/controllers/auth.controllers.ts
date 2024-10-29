import {Request, Response} from 'express'
import bcrypt from 'bcrypt'
import {v4 as uid} from 'uuid'
import { UserRoles } from '../models/auth.models'
import { registerSchema } from '../validators/auth.validators'
import { DbHelper } from '../databaseHelpers/index.helpers'


// instantiate the database helpers
const db = new DbHelper()

export async function registerUser (request:Request, response:Response){
    /*
    * This function aims to register new users into the system
    * the user id is auto-generated by uuid() module for maximum security
    * the admin role is added fist by default, other roles are selected by the user 
    * user input is validated and checked for errors using Joi before adding to the db
    * if no error present, using database helpers, user is added to the system
    * if an error is present the user will not be added to the database
    * a confirmation reponse is presented accordingly
    */

    const id=uid()
    const {firstName, lastName,userName,email,contactNumber,password,role} = request.body
    const {error} = registerSchema.validate(request.body)
    try {
        if(error){
            // return response.status(400).send(error.details[0].message)
            return response.status(400).send(error.message)
        } else {
            const hashedPassword = await bcrypt.hash(password,9)
            await db.exec('addUser', {
                id,
                firstName,
                lastName,
                userName,
                email,
                contactNumber,
                password:hashedPassword,
                role
            })
            return response.status(200).send({message:'Congratulations! You have successfully created a new account'})
        }
    } catch(error){
        return response.status(400).send(error)
    }
}