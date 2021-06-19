INSERT INTO province (name, name_ascii, code, createdAt, updatedAt) OUTPUT Inserted.*
VALUES (@name, @nameAscii, @code, @createdAt, @updatedAt)