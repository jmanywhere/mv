import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const examples = await prisma.funds.findMany();
  res.status(200).json(examples);
};

export default examples;
