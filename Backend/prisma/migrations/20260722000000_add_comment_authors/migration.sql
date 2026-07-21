ALTER TABLE "Comment" ADD COLUMN "authorId" TEXT;

UPDATE "Comment" AS c
SET "authorId" = t."createdById"
FROM "Ticket" AS t
WHERE c."ticketId" = t.id;

ALTER TABLE "Comment" ALTER COLUMN "authorId" SET NOT NULL;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
