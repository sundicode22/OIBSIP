import expressAsyncHandler from "express-async-handler";
import { loginSchema } from "../schema/auth.schema";

export const login = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const parsed = loginSchema.parse({ email, password });

});