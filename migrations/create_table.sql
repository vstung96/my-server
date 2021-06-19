-- DROP SCHEMA dbo;
CREATE SCHEMA dbo;
-- testdb.dbo.department definition
-- Drop table
-- DROP TABLE testdb.dbo.department GO
CREATE TABLE testdb.dbo.department (
	code varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	name nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	createdAt datetime NULL,
	updatedAt datetime NULL,
	CONSTRAINT PK__departme__357D4CF8F780B0DF PRIMARY KEY (code)
)
GO;
-- testdb.dbo.province definition
-- Drop table
-- DROP TABLE testdb.dbo.province GO
CREATE TABLE testdb.dbo.province (
	code varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	name nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	name_ascii varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	lock_down bit DEFAULT 0 NULL,
	createdAt datetime NULL,
	updatedAt datetime NULL,
	CONSTRAINT PK__province__357D4CF86C07DE2D PRIMARY KEY (code)
)
GO;
-- testdb.dbo.users definition
-- Drop table
-- DROP TABLE testdb.dbo.users GO
CREATE TABLE testdb.dbo.users (
	id int IDENTITY(1, 1) NOT NULL,
	username varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	identification_secret varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	full_name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	full_name_ascii varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	email varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	createdAt datetime NULL,
	updatedAt datetime NULL,
	CONSTRAINT PK__users__3213E83FFB99FB8B PRIMARY KEY (id)
)
GO;
-- testdb.dbo.employee definition
-- Drop table
-- DROP TABLE testdb.dbo.employee GO
CREATE TABLE testdb.dbo.employee (
	id int IDENTITY(1, 1) NOT NULL,
	province_code varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	department_code varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	name nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	name_ascii varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	temperature decimal(3, 1) NULL,
	createdAt datetime NULL,
	updatedAt datetime NULL,
	CONSTRAINT PK__employee__3213E83FAB21351C PRIMARY KEY (id),
	CONSTRAINT FK__employee__depart__6E01572D FOREIGN KEY (department_code) REFERENCES testdb.dbo.department(code),
	CONSTRAINT FK__employee__provin__6D0D32F4 FOREIGN KEY (province_code) REFERENCES testdb.dbo.province(code)
)
GO;
;