/*
  Warnings:

  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_bot` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `language_code` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "QuotesCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "qCategoriesId" INTEGER NOT NULL,
    "quotesCategoryId" INTEGER,
    FOREIGN KEY ("quotesCategoryId") REFERENCES "QuotesCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tId" INTEGER NOT NULL,
    "isBot" BOOLEAN,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT,
    "languageCode" TEXT,
    "token" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "tId", "token", "username") SELECT "id", "tId", "token", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.tId_unique" ON "User"("tId");
CREATE UNIQUE INDEX "User.token_unique" ON "User"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "QuotesCategory.name_unique" ON "QuotesCategory"("name");
