/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "users";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tId" INTEGER NOT NULL,
    "is_bot" BOOLEAN NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "username" TEXT,
    "language_code" TEXT,
    "token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.tId_unique" ON "User"("tId");
