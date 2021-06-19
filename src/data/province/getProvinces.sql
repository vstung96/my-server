SELECT *
FROM [province]
WHERE [name] LIKE @searchString
	OR [name_ascii] LIKE @searchString
	OR [code] LIKE @searchString
ORDER BY updatedAt DESC;