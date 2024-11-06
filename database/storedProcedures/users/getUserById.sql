CREATE OR ALTER PROCEDURE getUserById(
    @id VARCHAR(255)
)
AS
BEGIN
SELECT * FROM users
WHERE id=@id AND isDeleted=1
END;
GO