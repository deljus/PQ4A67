import type { User } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import type { RequestHandler } from "next-connect"
import withJoi from "next-joi"

import { prisma } from "@/db"
import { SERVER_STATUS } from "@/utils/const"

export const authMiddleware: RequestHandler<NextApiRequestAuth, NextApiResponse> = async (
  req,
  res,
  next
) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(SERVER_STATUS.UNAUTHORIZED).json({})
  }

  const user = await prisma.user.findUnique({ where: { token } })

  if (!user) {
    return res.status(SERVER_STATUS.UNAUTHORIZED).json({})
  }

  req.user = user
  next()
}

export type NextApiRequestAuth = {
  user: User
} & NextApiRequest

export const validate = withJoi({
  onValidationError: (_, res, error) => {
    return res.status(400).json({ message: error })
  },
})