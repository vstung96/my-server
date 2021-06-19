SELECT full_name,
    email,
    createdAt
FROM [dbo].[users]
WHERE [username] = @username
    AND [identification_secret] = @password