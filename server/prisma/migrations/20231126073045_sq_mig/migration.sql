-- CreateTable
CREATE TABLE "Friends" (
    "username" TEXT NOT NULL,
    "usercode" INTEGER NOT NULL,
    "friendsSince" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ReceivedFriendRequests" (
    "username" TEXT NOT NULL,
    "usercode" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "SentFriendRequests" (
    "username" TEXT NOT NULL,
    "usercode" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "OwnedServers" (
    "servername" TEXT NOT NULL,
    "servercode" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "MemberInServers" (
    "servername" TEXT NOT NULL,
    "servercode" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "JoinRequests" (
    "servername" TEXT NOT NULL,
    "servercode" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ServerUsers" (
    "servername" TEXT NOT NULL,
    "servercode" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Channels" (
    "acces" TEXT NOT NULL,
    "messageAcces" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ChannelUsers" (
    "servername" TEXT NOT NULL,
    "servercode" INTEGER NOT NULL,
    "messageAcces" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "ChannelMessages" (
    "index" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "sentBy" INTEGER NOT NULL,
    "sentAt" TEXT NOT NULL,
    "likes" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Friends_usercode_key" ON "Friends"("usercode");

-- CreateIndex
CREATE UNIQUE INDEX "ReceivedFriendRequests_usercode_key" ON "ReceivedFriendRequests"("usercode");

-- CreateIndex
CREATE UNIQUE INDEX "SentFriendRequests_usercode_key" ON "SentFriendRequests"("usercode");

-- CreateIndex
CREATE UNIQUE INDEX "OwnedServers_servercode_key" ON "OwnedServers"("servercode");

-- CreateIndex
CREATE UNIQUE INDEX "MemberInServers_servercode_key" ON "MemberInServers"("servercode");

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequests_servercode_key" ON "JoinRequests"("servercode");

-- CreateIndex
CREATE UNIQUE INDEX "ServerUsers_servercode_key" ON "ServerUsers"("servercode");

-- CreateIndex
CREATE UNIQUE INDEX "Channels_name_key" ON "Channels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelUsers_servercode_key" ON "ChannelUsers"("servercode");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelMessages_index_key" ON "ChannelMessages"("index");
