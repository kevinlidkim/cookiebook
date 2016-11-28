CREATE SCHEMA if not exists CookieBook;

####################################################
###                Entity Tables                 ###
####################################################

CREATE TABLE Person (
	personId INT AUTO_INCREMENT,
	lastName VARCHAR(30),
	firstName VARCHAR(30),
	address VARCHAR(50),
	city VARCHAR(20),
	state CHAR(2),
	zipCode INT,
	telephone BIGINT,
    PRIMARY KEY (personId),
    CHECK (zipcode <= 99999),
    CHECK (telephone <= 9999999999)
);
	
CREATE TABLE `User` (
	userId INT AUTO_INCREMENT,
    personId INT UNIQUE NOT NULL,
	accountCreateDate DATETIME NOT NULL,
    adPreferences VARCHAR(20),
    rating INT,
    email VARCHAR(30) UNIQUE,
    salt VARCHAR(30),
    hashedPassword VARCHAR(100),
    PRIMARY KEY (userId),
    FOREIGN KEY (personId) REFERENCES Person(personId)
);

CREATE TABLE PurchaseAccount (
	accountNumber INT AUTO_INCREMENT,
    creditCard BIGINT,
    PRIMARY KEY (accountNumber),
	CHECK (creditCard <= 9999999999999999)
);

CREATE TABLE `Group` (
	groupId INT AUTO_INCREMENT,
    groupName VARCHAR(30) NOT NULL,
    `type` VARCHAR(30),
    PRIMARY KEY (groupId)
);

CREATE TABLE `Page` (
	pageId INT AUTO_INCREMENT,
    postCount INT,
    PRIMARY KEY (pageId)
);

CREATE TABLE Post (
	postId INT AUTO_INCREMENT,
    content VARCHAR(250),
    commentCount INT,
    likes INT,
    PRIMARY KEY (postId)
);

CREATE TABLE `Comment` (
	commentId INT AUTO_INCREMENT,
    content VARCHAR(250),
    likes INT,
    PRIMARY KEY (commentId)
);

CREATE TABLE Message (
	messageId INT AUTO_INCREMENT,
    `subject` VARCHAR(100),
    content VARCHAR(250),
    PRIMARY KEY (messageId)
);

CREATE TABLE Employee (
	employeeId INT AUTO_INCREMENT,
    personId INT UNIQUE NOT NULL,
    ssn INT UNIQUE,
    startDate DATE,
    hourlyRate FLOAT,
    PRIMARY KEY (employeeId),
    FOREIGN KEY (personId) REFERENCES Person(personId),
    CHECK (ssn <= 999999999),
    CHECK (hourlyRate > 0.0)
);

CREATE TABLE Advertisement (
	advertisementId INT AUTO_INCREMENT,
    adType VARCHAR(20),
    company VARCHAR(50),
    itemName VARCHAR(50),
    content VARCHAR(250),
    unitPrice FLOAT,
    availableUnits INT,
    PRIMARY KEY (advertisementId)
);

####################################################
###               Relation Tables                ###
####################################################

CREATE TABLE OwnsPurchaseAccount(
    `owner` INT,
    accountNumber INT,
    PRIMARY KEY(`owner`, accountNumber),
    FOREIGN KEY(`owner`) REFERENCES `User`(userId),
    FOREIGN KEY(accountNumber) REFERENCES PurchaseAccount(accountNumber)
);

CREATE TABLE Sales (
	transactionId INT AUTO_INCREMENT,
    dateTimeSold DATETIME NOT NULL,
    advertisementId INT,
    numberOfUnits INT,
    accountNumber INT,
    PRIMARY KEY (transactionId),
    FOREIGN KEY (advertisementId) REFERENCES Advertisement(advertisementId),
    FOREIGN KEY (accountNumber) REFERENCES PurchaseAccount(accountNumber)
);

CREATE TABLE OwnsGroup (
	`owner` INT,
    `group` INT,
    PRIMARY KEY (`owner`, `group`),
    FOREIGN KEY (`owner`) REFERENCES `User`(userId),
    FOREIGN KEY (`group`) REFERENCES `Group`(groupId)
);

CREATE TABLE OwnsPage(
    `page` INT,
    `owner` INT,
    `group` INT,
    PRIMARY KEY(`page`),
    FOREIGN KEY(`page`) REFERENCES `Page`(pageId),
    FOREIGN KEY(`owner`) REFERENCES `User`(userId),
    FOREIGN KEY(`group`) REFERENCES `Group`(groupId),
    CHECK( (`owner` IS NOT NULL) XOR
        (`group` IS NOT NULL) )
);

CREATE TABLE MemberOfGroup (
	`user` INT,
    `group` INT,
    PRIMARY KEY (`user`, `group`),
    FOREIGN KEY (`user`) REFERENCES `User`(userId),
    FOREIGN KEY (`group`) REFERENCES `Group`(groupId)
);

CREATE TABLE PostedOn (
	post INT,
    `page` INT,
    `user` INT,
    dateTimePosted DATETIME NOT NULL,
    PRIMARY KEY (post, `page`, `user`),
    FOREIGN KEY (post) REFERENCES Post(postId),
    FOREIGN KEY (`page`) REFERENCES `Page`(pageId),
    FOREIGN KEY (`user`) REFERENCES `User`(userId)
);

CREATE TABLE LikesPost (
	post INT,
    `user` INT,
    PRIMARY KEY (post, `user`),
    FOREIGN KEY (post) REFERENCES Post(postId),
    FOREIGN KEY (`user`) REFERENCES `User`(userId)
);

CREATE TABLE CommentedOn (
	`comment` INT,
    post INT,
    `user` INT,
    dateTimePosted DATETIME NOT NULL,
    PRIMARY KEY (`comment`, post, `user`),
    FOREIGN KEY (`comment`) REFERENCES `Comment`(commentId),
    FOREIGN KEY (post) REFERENCES Post(postId),
    FOREIGN KEY (`user`) REFERENCES `User`(userId)
);

CREATE TABLE LikesComment (
	`comment` INT,
    `user` INT,
    PRIMARY KEY (`comment`, `user`),
    FOREIGN KEY (`comment`) REFERENCES `Comment`(commentId),
    FOREIGN KEY (`user`) REFERENCES `User`(userId)
);

CREATE TABLE FriendsWith (
	`user` INT,
    friend INT,
    PRIMARY KEY (`user`, friend),
    FOREIGN KEY (`user`) REFERENCES `User`(userId),
    FOREIGN KEY (friend) REFERENCES `User`(userId)
);

CREATE TABLE SentMessage (
    message INT AUTO_INCREMENT,
    sender INT,
    receiver INT,
    dateTimeSent DATETIME NOT NULL,
    PRIMARY KEY(message, sender, receiver),
    FOREIGN KEY(sender) REFERENCES `User`(userId),
    FOREIGN KEY(receiver) REFERENCES `User`(userId)
);

CREATE TABLE AdPostedBy (
    advertisement INT,
    employee INT,
    dateTimePosted DATETIME NOT NULL,
    PRIMARY KEY(advertisement, employee),
    FOREIGN KEY(advertisement) REFERENCES
        Advertisement(advertisementId),
    FOREIGN KEY(employee) REFERENCES Employee(employeeId)
);

CREATE TABLE Login (
	`user` INT,
    loggedIn BOOL,
    numberLogins INT,
    PRIMARY KEY (`user`),
    FOREIGN KEY (`user`) REFERENCES `User`(userId)
);

CREATE TABLE JoinGroupRequest (
	`user` INT,
    `group` INT,
    PRIMARY KEY (`user`, `group`),
    FOREIGN KEY (`user`) REFERENCES `User`(userId),
    FOREIGN KEY (`group`) REFERENCES `Group`(groupId)
);

CREATE TABLE FriendsRequest (
	`user` INT,
    friend INT,
    PRIMARY KEY (`user`, friend),
    FOREIGN KEY (`user`) REFERENCES `User`(userId),
    FOREIGN KEY (friend) REFERENCES `User`(userId)
);
