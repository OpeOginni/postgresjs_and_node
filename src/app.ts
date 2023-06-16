import express, { NextFunction, Request, Response } from "express";
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { sql } from "./db";

const app = express();

app.use(cors());


app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
})

interface user {
    first_name: string,
    last_name: string,
    email: string,
    password: string
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Get the user from the DataBase and prevent SQL Injection
        const user = await sql<user[]>`
              SELECT
                *
              FROM public.users
              WHERE 
                users.email like ${email + '%'} 
            `

        // Return error if that user cant be found
        if (user.length === 0) {
            return res.status(400).json({ success: false, message: "No user with that Email" })
        }

        // We check if the password in the database is the same password that the user is inputing
        if (user[0].password === password)
            return res.status(200).json({ success: true, user: user, message: "Signed In Successfully...Welcome" })
        else {
            return res.status(400).json({ success: false, message: "Wrong Password" })
        }
    } catch (err) {
        return res.status(400).json({ success: false, message: "Something went wrong" })
    }


}

const signup = async (req: Request, res: Response) => {

    // Get the Signup details that are passed
    const { first_name, last_name, email, password } = req.body;

    try {
        // Get the user from the DataBase
        const oldUser = await sql<user[]>`
              SELECT
               *
             FROM public.users
             WHERE 
               users.email like ${email + '%'}
                 `

        // Check if that user already exists
        if (oldUser[0]) {
            return res.status(400).json({ success: false, message: "User with that Email Already Exisits" })
        }

        // Create the User using SQL 
        const user = await sql<user[]>`
        INSERT INTO public.users
          (first_name, last_name, email, password)
        VALUES (${first_name}, ${last_name}, ${email}, ${password})
        returning *
        `
        // We return the user object
        return res.status(200).json({ success: true, user: user[0] })
    } catch (err) {
        // We return a code 400 if we get an error
        console.log(err)
        return res.status(400).json({ success: false, message: "Something went wrong" })
    }
}

app.post('/login', login)
app.post('/signup', signup)
