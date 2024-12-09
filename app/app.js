import express from 'express';
import { createSMTPServer } from '../server/SMTPserver.js';
import { User } from '../utils/mongo/userSchema.js';
import { Mail } from '../utils/mongo/mailSchema.js';

const app = express();

const PORT = process.env.PORT || 3000;


createSMTPServer();

app.use(express.json());    

app.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        console.log(req.body)
        console.log(username, password, email)
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
        const {username, password} = req.body;
        const user = await User.findOne({username, password});
        if(user){
            res.status(200).json({
                success: true,
                message: "User logged in successfully",
            })
        }
        res.status(401).json({
            success: false,
            message: "Invalid credentials",
        })
    } catch (error) {
        console.error(error);
    }
})

app.post('/send', async (req, res) => {
    try {
        const { author, to, subject, content, attachaments } = req.body;
        const mail = new Mail({ author, to, subject, content, attachaments });
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})