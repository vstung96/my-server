SELECT COUNT(
        CASE
            WHEN p.lock_down = 1 then 1
        END
    ) as numberLockDown,
    COUNT(
        CASE
            WHEN p.lock_down = 0 then 1
        END
    ) as numberUnlockDown,
    COUNT(
        CASE
            WHEN e.temperature >= 38 then 1
        END
    ) as greaterOrEqual38,
    COUNT(
        CASE
            WHEN e.temperature < 38 then 0
        END
    ) as lowerThan38,
    count(e.temperature) as totalEmployee,
    d.code as departmentName
FROM employee e
    JOIN province p ON p.code = e.province_code
    JOIN department d ON d.code = e.department_code
WHERE convert(varchar, e.updatedAt, 101) = @updatedAt
GROUP BY d.code;