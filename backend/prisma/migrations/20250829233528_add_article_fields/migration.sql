-- AlterTable
ALTER TABLE "public"."blogs" ADD COLUMN     "author" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."article_widgets" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "settings" JSONB,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_widgets_pkey" PRIMARY KEY ("id")
);
