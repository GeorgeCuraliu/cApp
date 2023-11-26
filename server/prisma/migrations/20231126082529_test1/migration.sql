/*
  Warnings:

  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "username" TEXT NOT NULL,
    "usercode" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" BOOLEAN NOT NULL,
    "admin" BOOLEAN NOT NULL
);
INSERT INTO "new_Users" ("admin", "profilePicture", "usercode", "username") SELECT "admin", "profilePicture", "usercode", "username" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_usercode_key" ON "Users"("usercode");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
