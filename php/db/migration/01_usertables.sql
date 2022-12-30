CREATE TABLE USERS (
    EMAIL nvarchar(255),
    NAME nvarchar(255),
    PASSWORD_HASH nvarchar(255),
    LAST_LOGIN DATE,
    ID int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(ID)
);
