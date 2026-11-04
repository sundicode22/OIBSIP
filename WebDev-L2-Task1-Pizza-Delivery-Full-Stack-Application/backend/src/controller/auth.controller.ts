import expressAsyncHandler from "express-async-handler";

export const login = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
});