-- Never retain plaintext passwords.  Application code stores bcrypt hashes only.
ALTER TABLE "User" DROP COLUMN "originalPassword";

-- Enforce the identifiers that the API already treats as unique.
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Ticket_ticketNumber_key" ON "Ticket"("ticketNumber");
