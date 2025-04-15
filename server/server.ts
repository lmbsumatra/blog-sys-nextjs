// get env
import dotenv from 'dotenv';
import cors from "cors";
import path from "path";
import express from "express";
import type { Express, Request, Response } from "express";
import cookieParser from 'cookie-parser';
import passport from "passport";

import { errorHandler } from "./src/middlewares/errorHandler"
import morganMiddleware from "./src/middlewares/morgan"
import "./src/auth/google";

const app: Express = express();
dotenv.config();

// routes
import UsersRoutes from "./src/routes/UsersRoutes";
import BlogsRoutes from "./src/routes/BlogsRoutes";
import AuthRoutes from "../server/src/routes/AuthRoutes";

app.use(cors({
  origin: 'http://localhost:3000', //
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
  credentials: true, // allow cookies to be sent with requests
}));

app.use(morganMiddleware);

// app.use(apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// image view
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.get('/me', async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.token;

  try {
    if (!token) {
      res.json({ message: 'Not authenticated' });  // Send the response and return
      return;
    }

    res.json({ message: 'You are logged in', token });
  }
  catch (error: any) {
    res.status(500).json({ message: 'Internal server error' }); // Handle errors properly
  }
});


app.use("/api/users", UsersRoutes);
app.use("/api/blogs", BlogsRoutes);
app.use("/api/auth", AuthRoutes);

app.use(errorHandler);


app.listen(process.env.PORT, () => {
  console.log(
    `App is now running, and is listening to port ${process.env.PORT}`
  );
});
