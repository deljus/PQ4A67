-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tId" INTEGER NOT NULL,
    "is_bot" BOOLEAN NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "username" TEXT,
    "language_code" TEXT,
    "token" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users.tId_unique" ON "users"("tId");
