-- AlterTable
ALTER TABLE "public"."blogs" ADD COLUMN     "htmlWidgetIds" TEXT[];

-- CreateTable
CREATE TABLE "public"."html_widgets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "htmlContent" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "html_widgets_pkey" PRIMARY KEY ("id")
);
