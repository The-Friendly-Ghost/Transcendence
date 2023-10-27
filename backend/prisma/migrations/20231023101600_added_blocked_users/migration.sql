/*
  Warnings:

  - You are about to drop the column `chatRoomId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `chatroomId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatRoomId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chatRoomId",
ADD COLUMN     "chatroomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockedUserIds" INTEGER[];

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
