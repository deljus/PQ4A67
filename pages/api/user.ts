import { NextApiResponse } from "next"
import connect from "next-connect"

import { authMiddleware, NextApiRequestAuth } from "@/utils/server"

export default connect<NextApiRequestAuth, NextApiResponse>()
  .use(authMiddleware)
  .get((req, res) => res.json(req.user))