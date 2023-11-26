-- CreateTable
CREATE TABLE "MB9DATA" (
    "applicationName" TEXT NOT NULL DEFAULT 'MrBlec`s chat app',
    "currentUserOrder" INTEGER NOT NULL,
    "currentChatFileNumber" INTEGER NOT NULL,
    "currentServerNumber" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Users" (
    "username" TEXT NOT NULL,
    "usercode" INTEGER NOT NULL,
    "profilePicture" BOOLEAN NOT NULL,
    "admin" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Servers" (
    "name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "mainChannel" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MB9DATA_applicationName_key" ON "MB9DATA"("applicationName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_usercode_key" ON "Users"("usercode");

-- CreateIndex
CREATE UNIQUE INDEX "Servers_code_key" ON "Servers"("code");
