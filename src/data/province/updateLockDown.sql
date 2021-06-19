UPDATE [province]
SET [lock_down] = @lockDown,
    [updatedAt] = @updatedAt
WHERE [code] = @code