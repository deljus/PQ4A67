import { NextApiResponse } from "next"
import connect from "next-connect"
import * as yup from "yup"

import { prisma } from "@/db"
import { SERVER_STATUS, RESTRICTIONS } from "@/utils/const"
import { authMiddleware, NextApiRequestAuth, validate } from "@/utils/server"

const putSchema = yup.object().shape({
  name: yup.string().required(),
})

const delValidate = yup.object().shape({
  id: yup.number().required(),
})

export default connect<NextApiRequestAuth, NextApiResponse>()
  .use(authMiddleware)
  .get(async (req, res) => {
    const { userName, order, name, skip, take } = req.query as ServerSearchParams
    const categories = await prisma.category.findMany({
      skip: Number(skip),
      take: Number(take),
      where: {
        name: {
          contains: name,
        },
        User: {
          userName: {
            contains: userName,
          },
        },
      },
      include: {
        User: {
          select: {
            userName: true,
          },
        },
      },
      orderBy: {
        createdAt: order,
      },
    })
    return res.json(categories)
  })
  .put(validate({ body: putSchema }), async (req, res) => {
    try {
      const userCategoryCount = await prisma.category.count({
        where: {
          userId: req.user.userId,
        },
      })

      if (userCategoryCount >= RESTRICTIONS.CATEGORY_CREATE_COUNT) {
        return res
          .status(SERVER_STATUS.BAD_REQUEST)
          .json({
            message: `Вы привысили ограничения в ${RESTRICTIONS.CATEGORY_CREATE_COUNT} записей.`,
          })
      }

      const category = await prisma.category.create({
        data: {
          name: req.body.name,
          userId: req.user.userId,
          description: req.body.description,
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
    const category = await prisma.category.delete({
      where: {
        categoryId: req.body.categoryId,
      },
    })

    return res.json(category)
  })
