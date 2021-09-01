import dotenv from "dotenv"
import TelegramBot from "node-telegram-bot-api"

import { prisma } from "../db"

dotenv.config()

const token = process.env.BOT_TOKEN

if (!token) {
  throw new Error("token empty!")
}

const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/pq/, async ({ chat }) => {
  return bot.sendMessage(
    chat.id,
    '<b>Привет!</b> <i>Это бот PQ4A67</i> <i>Для того чтобы редактировать меня напишите мне в личку команду /token </i><b>Далее зайдите на <a href="http://137.184.47.198/">сайт</a> и авторизуйтесь! </b>',
    { parse_mode: "HTML" }
  )
})

bot.onText(/\/token/, async ({ from, chat }) => {
  if (from?.id !== chat.id) {
    return bot.sendMessage(chat.id, "Пожалуйста напиши мне в личку и я выдам токен!")
  }
  const token = (
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  ).toUpperCase()

  try {
    await prisma.user.upsert({
      where: {
        tId: from.id,
      },
      update: {
        token,
      },
      create: {
        tId: from.id,
        userName: from.username || "userName",
        lastName: from.last_name,
        firstName: from.first_name,
        isBot: from.is_bot,
        languageCode: from.language_code,
        token,
      },
    })
    await bot.sendMessage(chat.id, token)
  } catch (e) {
    console.log(e)
    await bot.sendMessage(chat.id, "что то пошло не так(((")
  }
})

bot.onText(/\/pq(.+)/, async (msg, match) => {
  const chatId = msg.chat.id

  if (!match) return bot.sendMessage(chatId, "Я тоже рад тебя видеть 😀")

  const name = match[1]

  const category = await prisma.category.findUnique({
    select: {
      posts: {
        select: {
          text: true,
          image: true,
        },
      },
    },
    where: {
      name,
    },
  })

  if (!category) {
    return bot.sendMessage(chatId, "К сожелению такой категории нет. 😩")
  }

  const { posts } = category

  if (!category.posts.length) {
    return bot.sendMessage(chatId, "Я нашел нужную категорию, но она пуста. 😨")
  }

  const post = posts[Math.floor(Math.random() * posts.length)]

  if (post.image) {
    return bot.sendPhoto(chatId, post.image, { caption: post.text ? post.text : undefined })
  }

  if (post.text) {
    return bot.sendMessage(chatId, post.text)
  }

  return bot.sendMessage(
    chatId,
    "У записи нет тела и изображения. Он прошел через мою супер валидацию! 🤔"
  )
})
