import { NextApiResponse } from "next"
import connect from "next-connect"
import * as yup from "yup"

import { prisma } from "@/db"
import { SERVER_STATUS } from "@/utils/const"
import { authMiddleware, NextApiRequestAuth, validate } from "@/utils/server"

const delValidate = yup.object().shape({
  postId: yup.number().required(),
})

export default connect<NextApiRequestAuth, NextApiResponse>()
  .use(authMiddleware)
  .get(async (req, res) => {
    const { categoryId, userName, order, name } = req.query as {
      categoryId: string
    } & ServerSearchParams
    const posts = await prisma.post.findMany({
      where: {
        categoryId: Number(categoryId),
        text: {
          contains: name,
        },
        User: {
          userName: {
            contains: userName,
          },
        },
      },
      orderBy: {
        createdAt: order,
      },
      include: {
        User: {
          select: {
            userName: true,
          },
        },
        Category: true,
      },
    })
    return res.json(posts)
  })
  .put(async (req, res) => {
    try {
      const category = await prisma.post.create({
        data: {
          text: req.body.text,
          image: req.body.image,
          userId: req.user.userId,
          categoryId: Number(req.query.categoryId),
        },
      })

      return res.json(category)
    } catch (e) {
      return res
        .status(SERVER_STATUS.BAD_REQUEST)
        .json({ message: "Что то пошло не так или вы пытаетесь создать то что уже есть!" })
    }
  })
  .delete(validate({ body: delValidate }), async (req, res) => {
    const category = await prisma.post.delete({
      where: {
        postId: req.body.postId,
      },
    })

    return res.json(category)
  })
