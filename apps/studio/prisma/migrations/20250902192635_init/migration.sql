-- CreateTable
CREATE TABLE "Demo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "index" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "selector" TEXT,
    "selectorAlt" TEXT,
    "textSnippet" TEXT,
    "ariaRole" TEXT,
    "bboxX" INTEGER,
    "bboxY" INTEGER,
    "bboxW" INTEGER,
    "bboxH" INTEGER,
    "scrollTop" INTEGER,
    "scrollLeft" INTEGER,
    "valueBefore" TEXT,
    "valueAfter" TEXT,
    "delayMs" INTEGER,
    "screenshotUrl" TEXT,
    "caption" TEXT,
    "demoId" TEXT NOT NULL,
    CONSTRAINT "Step_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Demo_publicId_key" ON "Demo"("publicId");
