/*
  Warnings:

  - Added the required column `postId` to the `Random` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Random" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "lastCallAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" INTEGER NOT NULL,
    FOREIGN KEY ("categoryId") REFERENCES "Category" ("categoryId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Random" ("categoryId", "chatId", "id", "lastCallAt") SELECT "categoryId", "chatId", "id", "lastCallAt" FROM "Random";
DROP TABLE "Random";
ALTER TABLE "new_Random" RENAME TO "Random";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
