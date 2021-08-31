/*
  Warnings:

  - You are about to drop the column `userName` on the `Category` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Random" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "lastCallAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("categoryId") REFERENCES "Category" ("categoryId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "categoryId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "randomDelay" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("categoryId", "createdAt", "name", "updatedAt", "userId") SELECT "categoryId", "createdAt", "name", "updatedAt", "userId" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category.name_unique" ON "Category"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
