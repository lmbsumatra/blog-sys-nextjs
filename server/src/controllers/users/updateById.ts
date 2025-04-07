import { userServices } from "../../services/userServices";
import bcrypt from "bcrypt";
const saltRounds = 10;
import { userUpdateValidator } from "../../validators/userUpdateValidator";
import { ZodError } from "zod";
export const updateById = async (req: any, res: any) => {
  // const updates = req.body;
  // const id = req.params.id;
  // try {
  //   // check data
  //   if (!Object.keys(updates).length === (null || 0)) {
  //     return res.status(400).json({ error: "No data to update" });
  //   }

  //   const userUpdateValidationResult = userUpdateValidation.parse({
  //     ...updates,
  //     id: id,
  //   });

  //   updates.password = await bcrypt.hash(updates.password, saltRounds);

  //   const updatedItem = await userServices.updateUser(updates, id);

  //   res.send({ updatedItem });
  // } catch (error) {
  //   if (error instanceof ZodError) {
  //     console.log("Validation Failed:", error.flatten());

  //     return res.status(400).json({
  //       message: "Validation failed",
  //       errors: error.flatten(),
  //     });
  //   }
  //   res.status(400).json({ error: error.message });
  // }
};


