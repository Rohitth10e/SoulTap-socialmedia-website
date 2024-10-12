const express = require('express');
const userModel = require('./models/user');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const postModel = require('./models/post')
const moment = require('moment')
const path = require('path')
const multer=require('multer')
const upload = require('./config/multerconfig')

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/register', async (req, res) => {
    const { name, username, email, age, password } = req.body;

    try {
        const isPresent = await userModel.findOne({ email });

        if (isPresent) {
            return res.status(400).json({ message: 'User already exists', user: isPresent });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            name,
            username,
            age,
            email,
            password: hash,
        });

        const token = jwt.sign({ email: email, userId: user._id }, 'verySecretKey69', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        // res.status(201).json({ message: 'User registered', user: user });
        res.redirect("/profile")
    } catch (error) {
        // res.status(500).json({ message: 'Server error', error: error.message });
        res.redirect("/")
    }
});

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if (!user) return res.json({ message: "Something went wrong" })

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.json({ message: "Invalid credentials" })
            }
            const token = jwt.sign({ email: email, userId: user._id }, 'verySecretKey69', { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            // res.json({ message: "Login Successfull", user: user })
            res.redirect("profile");
        })


    } catch (err) {
        console.log(err.message);
    }
})

app.get("/profile", isLoggedIn, async (req, res) => {
    const email = req.user.email;
    try {
        const user = await userModel.findOne({ email }).populate({
            path: 'posts',
            populate: {
                path: 'user',
                select: 'username'
            }
        });
        res.render("profile", { user });
    } catch (err) {
        console.log(err.message);
        res.redirect("/login");
    }
});


app.get("/profile/upload", isLoggedIn, async (req, res) => {
    res.render("profileupload")
})

app.post("/upload", isLoggedIn, upload.single('image'), async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        console.log(req.file)
        user.profilePicture=req.file.filename;
        await user.save();
        res.redirect("/profile")
    } catch (err) {
        console.log("error: ", err.message);
        res.redirect("/");
    }
});


app.post("/post", isLoggedIn, async (req, res) => {
    const { postContent } = req.body;
    try {
        const user = await userModel.findOne({ email: req.user.email });

        const post = await postModel.create({
            user: user._id,
            content: postContent.trim()
        })

        user.posts.push(post._id);
        await user.save();

        res.redirect("/profile");
    } catch (err) {
        res.redirect("/profile")
    }
})

app.get('/like/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await postModel.findOne({ _id: req.params.id }).populate("user")
        console.log(req.user)
        if (post.likes.indexOf(req.user.userId) == -1) {
            post.likes.push(req.user.userId)
        } else {
            post.likes.splice(post.likes.indexOf(req.user.userId), 1);
        }
        await post.save();
        res.redirect("/profile")
    } catch (err) {
        console.log("err", err.message);
    }
})

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await postModel.findOne({ _id: req.params.id })
        console.log(post)
        res.render("edit", { post })
        // res.redirect("/profile")
    } catch (err) {
        console.log("error", err.message);
        res.redirect("/profile")
    }
})

app.post('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const updatedPost = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.postContent.trim() }, { new: true })
        res.redirect("/profile")
    } catch (err) {
        console.log(err.message);
        res.redirect("/profile")
    }
})

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    // res.json({ message: "User logged out" });
    res.redirect("/login")
})

function isLoggedIn(req, res, next) {
    if (req.cookies.token === "") res.redirect("/login");
    const data = jwt.verify(req.cookies.token, "verySecretKey69")
    req.user = data;
    next();
}

app.listen(3000, () => console.log('server running'));
