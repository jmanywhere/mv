-- CreateEnum
CREATE TYPE "SocialTypes" AS ENUM ('TWITTER', 'FB', 'DISCORD', 'TELEGRAM', 'MEDIUM', 'REDDIT');

-- CreateTable
CREATE TABLE "Raise" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contract" TEXT NOT NULL,
    "raised" BIGINT NOT NULL,
    "goal" BIGINT NOT NULL,
    "showcase" BOOLEAN NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo_icon" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,

    CONSTRAINT "Raise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "duration" BIGINT NOT NULL,
    "raiseId" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Writeup" (
    "id" TEXT NOT NULL,
    "raiseId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Writeup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "writer" BOOLEAN NOT NULL,
    "dev" BOOLEAN NOT NULL,
    "auditor" BOOLEAN NOT NULL,
    "other" BOOLEAN NOT NULL,
    "otherDetail" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialsOnFunds" (
    "raiseId" TEXT NOT NULL,
    "socialId" INTEGER NOT NULL,

    CONSTRAINT "SocialsOnFunds_pkey" PRIMARY KEY ("raiseId","socialId")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chain" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "rpcs" TEXT[],

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnRaise" (
    "raiseId" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "TagsOnRaise_pkey" PRIMARY KEY ("raiseId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Social_id_key" ON "Social"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Social_url_key" ON "Social"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Chain_id_key" ON "Chain"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_id_key" ON "Tag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "Raise" ADD CONSTRAINT "Raise_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_raiseId_fkey" FOREIGN KEY ("raiseId") REFERENCES "Raise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Writeup" ADD CONSTRAINT "Writeup_raiseId_fkey" FOREIGN KEY ("raiseId") REFERENCES "Raise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Writeup" ADD CONSTRAINT "Writeup_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialsOnFunds" ADD CONSTRAINT "SocialsOnFunds_raiseId_fkey" FOREIGN KEY ("raiseId") REFERENCES "Raise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialsOnFunds" ADD CONSTRAINT "SocialsOnFunds_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "Social"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnRaise" ADD CONSTRAINT "TagsOnRaise_raiseId_fkey" FOREIGN KEY ("raiseId") REFERENCES "Raise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnRaise" ADD CONSTRAINT "TagsOnRaise_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
