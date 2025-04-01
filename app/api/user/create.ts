import { insert } from "@/services/userServices";
import { NextApiRequest, NextApiResponse } from "next";

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {

      const { firstName, middleName, lastName, userName, email, password, role } = req.body;


      const userData = {
        firstName,
        middleName,
        lastName,
        userName,
        email,
        password,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newUser = await insert([userData]);
      console.log("User created:", newUser);

      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Failed to create user" });
    }
  } else {
    console.log("Method not allowed");
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default createUser;
