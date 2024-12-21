const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Student = require("../models/student");
const logger = require("../logger");
const jwt  = require('jsonwebtoken');

// Secret key for JWT (store it in environment variables)
const JWT_SECRET = 'helloworld';

// SignUp
exports.signup_post = [
    body("name")
      .trim()
      .isLength({min: 3})
      .escape()
      .withMessage("The name is too short"),
    body("roll_number")
      .trim()
      .isLength({min: 9, max: 10})
      .escape()
      .withMessage("Invalid roll number"),
    body("password")
      .trim()
      .isLength({min: 5})
      .escape()
      .withMessage("Invalid password"),
    body("batch").escape(),

    asyncHandler(async (req, res, next) => {
        if(!req.body.roll_number || !req.body.password || !req.body.name || !req.body.batch) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try { 
            logger.info("Signup request");
            const errors = validationResult(req);

            if(!errors.isEmpty) {
                logger.error(errors);
                res.json({ title: "Login", errors: errors.array()});
            } else {
                const existingUser = await Student.findOne({roll_number: req.body.roll_number});
                if(existingUser) {return res.status(400).json({message: "Roll number already exists"})};

                const newStudent = new Student({
                    name: req.body.name,
                    roll_number: req.body.roll_number,
                    password: req.body.password,
                    batch: req.body.batch,
                });

                await newStudent.save();
                
                return res.status(201).json({message: "Registration successful. You can now login"});
            }
        } catch {
            logger.error("Error during signup:", error);
            console.log("Hello world");
            return res.status(500).json({ message: "Server error, please try again later" });
        }
    }
)];

// Login
exports.login_post = [
    body("roll_number")
      .trim()
      .isLength({min: 9, max: 10})
      .escape()
      .withMessage("Invalid roll number"),
    body("password")
      .trim()
      .isLength({min: 5})
      .escape()
      .withMessage("Invalid password"),

    asyncHandler(async (req, res, next) => {
        if(!req.body.roll_number || !req.body.password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        try { 
            logger.info("Login request");
            const errors = validationResult(req);

            if(!errors.isEmpty) {
                logger.error(errors);
                res.json({ title: "Login", errors: errors.array()});
            } else {
                const student = await Student.findOne({roll_number: req.body.roll_number});
                if(!student) {return res.status(400).json({message: "Invalid roll number or password"})};
                
                const isMatch = await student.comparePassword(req.body.password);
                if(!isMatch) {return res.status(400).json({message: "Invalid roll number or password"})};

                const token = jwt.sign(
                    {
                        name: student.name,
                        id: student._id, 
                        roll_number: student.roll_number
                    },
                    JWT_SECRET,
                    {expiresIn: '1h'}
                );

                return res.status(200).json({ message: "Login successful", token });
            }
        } catch {
            logger.error("Error during authentication:", error);
            return res.status(500).json({ message: "Server error, please try again later" });
        }
    }
)];