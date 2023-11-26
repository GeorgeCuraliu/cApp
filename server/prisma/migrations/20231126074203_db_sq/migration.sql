/*
  Warnings:

  - You are about to drop the `ChannelMessages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Channels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Friends` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JoinRequests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberInServers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OwnedServers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReceivedFriendRequests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SentFriendRequests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServerUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChannelMessages";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChannelUsers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Channels";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Friends";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "JoinRequests";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MemberInServers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OwnedServers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ReceivedFriendRequests";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SentFriendRequests";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ServerUsers";
PRAGMA foreign_keys=on;
