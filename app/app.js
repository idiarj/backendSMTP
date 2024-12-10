import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { createSMTPServer } from '../server/SMTPserver.js';
import { User } from '../utils/mongo/userSchema.js';
import { Mail } from '../utils/mongo/mailSchema.js';

const app = express();

const PORT = process.env.PORT || 3000;


//createSMTPServer();

app.use(express.json());    
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(cors({
    origin: '*',
    credentials: true,
}))

app.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        console.log(req.body)
        console.log(username, password, email)
        const userAlreadyExists = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
        if(userAlreadyExists){
            console.log('el usuario ya existe')
            return res.status(400).json({
                success: false,
                error: "El nombre de usuario ya existe.",
            })
        }
        const emailAlreadyExists = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if(emailAlreadyExists){
            console.log('el email ya existe')
            return res.status(400).json({
                success: false,
                error: "El email ya existe.",
            })
        }
        const user = new User({ username, password, email });
        await user.save();
        res.status(200).json({
            succes: true,
            message: "User registered successfully",
        })
    } catch (error) {
        console.error(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(req.body)
        const user = await User.findOne({email, password});
        const users = await User.find();
        //console.log(users)
        console.log(user)
        if(user){
            req.session.userId = user._id;
            res.status(200).json({
                success: true,
                message: "User logged in successfully",
            })
        }
        res.status(401).json({
            success: false,
            message: "Credenciales invalidas",
        })
    } catch (error) {
        console.error(error);
    }
})

app.post('mail/sendMail', async (req, res) => {
    try {
        const { to, subject, content, attachaments } = req.body;
        const { userId } = req.user;
        console.log(req.body)
        console.log(req.user)
        const mail = new Mail({ author: userId, to, subject, content, attachaments });
        await mail.save();
        res.status(200).json({
            success: true,
            message: "Mail sent successfully",
        })
    } catch (error) {
        console.error(error);
    }
})

app.get('/mails/received', async (req, res) => {
    try {
        const {userId} = req.user
      const mail = await Mail.find({to: userId});  
      res.status(200).json({
            success: true,
            mail,
      })
    } catch (error) {
        console.error(error);
    }
})

app.get('/mails/sent', async (req, res) => {
    try {
        const {userId} = req.user
      const mail = await Mail.find({author: userId});  
      res.status(200).json({
            success: true,
            mail,
      })
    } catch (error) {
        console.error(error);
    }
})

app.post('/logout', async (req, res) => {
    try {
        const {userId} = req.user;
        console.log(userId)
        if(userId){
            console.log('entro')
            req.session.destroy();
            res.status(200).json({
                success: true,
                message: "User logged out successfully",
            })
        }
        res.status(401).json({
            success: false,
            message: "No user logged in",
        })
    } catch (error) {
        console.error(error);
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})