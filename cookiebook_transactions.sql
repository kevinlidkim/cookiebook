
####################################################
###             Transactions Tables              ###
####################################################

DELIMITER $$
CREATE PROCEDURE LikePost(IN pid INT, IN uid INT)
	BEGIN
    INSERT INTO LikesPost(post, `user`) VALUES (pid, uid);
    UPDATE Post
		SET Post.likes = likes + 1
		WHERE Post.postId = pid;
    END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE UnlikePost(IN pid INT, IN uid INT)
	BEGIN
    DELETE FROM LikesPost
		WHERE LikesPost.postId = pid AND LikesPost.userId = uid;
    UPDATE Post
		SET Post.likes = likes - 1
		WHERE Post.postId = pid;
    END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE LikeComment(IN in_commentId INT, IN in_userId INT)
	BEGIN
    INSERT INTO LikesComment(`comment`, `user`) VALUES (in_commentId, in_userId);
    UPDATE `Comment`
		SET `Comment`.likes = likes + 1
		WHERE `Comment`.commentId = in_commentId;
    END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE UnlikeComment(IN in_commentId INT, IN in_userId INT)
	BEGIN
    DELETE FROM LikesComment
		WHERE LikesComment.commentId = in_commentId AND LikesComment.userId = in_userId;
    UPDATE `Comment`
		SET `Comment`.likes = likes - 1
		WHERE `Comment`.commentId = in_commentId;
    END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE JoinGroup (IN in_groupId INT, IN in_userId INT)
	BEGIN
    IF EXISTS
		(SELECT *
			FROM JoinGroupRequest
            WHERE JoinGroupRequest.`user` = in_userId AND JoinGroupRequest.`group` = in_groupId)
	THEN
		INSERT INTO MemberOfGroup(`group`, `user`) VALUES (in_groupId, in_userId);
        DELETE FROM JoinGroupRequest
			WHERE JoinGroupRequest.groupId = in_groupId AND JoinGroupRequest.userId = in_userId;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE LeaveGroup (IN in_groupId INT, IN in_userId INT)
	BEGIN
    DELETE FROM MemberOfGroup
		WHERE MemberOfGroup.groupId = in_groupId AND MemberOfGroup.userId = in_userId;
	END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE PostOnGroup (IN in_pageId INT, IN in_groupId INT, IN in_userId INT, IN in_postId INT)
	BEGIN
    IF EXISTS
		(SELECT *
			FROM MemberOfGroup
			WHERE MemberOfGroup.`user` = in_userId AND MemberOfGroup.`group` = in_groupId)
    THEN 
		IF EXISTS
			(SELECT * 
				FROM OwnsPage
                WHERE OwnsPage.`group` = in_groupId AND OwnsPage.`page` = in_pageId)
		THEN
			INSERT INTO PostedOn(post, `page`, `user`) VALUES (in_postId, in_pageId, in_userId);
            UPDATE `Page`
				SET `Page`.postCount = `Page`.postCount + 1
                WHERE `Page`.pageId = in_pageId;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE CommentOnGroup (IN in_pageId INT, IN in_groupId INT, IN in_userId INT, IN in_postId INT, IN in_commentId INT)
	BEGIN
    IF EXISTS
		(SELECT *
			FROM MemberOfGroup
			WHERE MemberOfGroup.`user` = in_userId AND MemberOfGroup.`group` = in_groupId)
    THEN 
		IF EXISTS
			(SELECT * 
				FROM OwnsPage
                WHERE OwnsPage.`group` = in_groupId AND OwnsPage.`page` = in_pageId)
		THEN
			IF EXISTS
				(SELECT *
					FROM PostedOn
                    WHERE PostedOn.post = in_postID AND PostedOn.`page` = in_pageId)
			THEN
				INSERT INTO CommentedOn(`comment`, post, `user`) VALUES (in_commentId, in_postId, in_userId);
			END IF;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE LikeGroupPost (IN in_pageId INT, IN in_groupId INT, IN in_userId INT, IN in_postId INT)
	BEGIN
    IF EXISTS
		(SELECT *
			FROM MemberOfGroup
			WHERE MemberOfGroup.`user` = in_userId AND MemberOfGroup.`group` = in_groupId)
    THEN 
		IF EXISTS
			(SELECT * 
				FROM OwnsPage
                WHERE OwnsPage.`group` = in_groupId AND OwnsPage.`page` = in_pageId)
		THEN
			IF EXISTS
				(SELECT *
					FROM PostedOn
                    WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId)
			THEN
				INSERT INTO LikesPost(post, `user`) VALUES (in_postId, in_userId);
				UPDATE Post
					SET Post.likes = likes + 1
					WHERE Post.postId = in_postId;
			END IF;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE LikeGroupComment (IN in_pageId INT, IN in_groupId INT, IN in_userId INT, IN in_postId INT, IN in_commentId INT)
	BEGIN
    IF EXISTS
		(SELECT *
			FROM MemberOfGroup
			WHERE MemberOfGroup.`user` = in_userId AND MemberOfGroup.`group` = in_groupId)
    THEN 
		IF EXISTS
			(SELECT * 
				FROM OwnsPage
                WHERE OwnsPage.`group` = in_groupId AND OwnsPage.`page` = in_pageId)
		THEN
			IF EXISTS
				(SELECT *
					FROM PostedOn
                    WHERE PostedOn.post = in_postID AND PostedOn.`page` = in_pageId)
			THEN
				IF EXISTS
					(SELECT *
						FROM CommentedOn
                        WHERE CommentedOn.`comment` = in_commentId AND CommentedOn.post = in_postId)
				THEN
					INSERT INTO LikesComment(`comment`, `user`) VALUES (in_commentId, in_userId);
					UPDATE `Comment`
						SET `Comment`.likes = likes + 1
						WHERE `Comment`.commentId = in_commentId;
				END IF;
			END IF;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE DeleteGroupPost (IN in_pageId INT, IN in_groupId INT, IN in_userId INT, IN in_postId INT)
	BEGIN
    IF EXISTS
		(SELECT *
			FROM MemberOfGroup
			WHERE MemberOfGroup.`user` = in_userId AND MemberOfGroup.`group` = in_groupId)
    THEN 
		IF EXISTS
			(SELECT * 
				FROM OwnsPage
                WHERE OwnsPage.`group` = in_groupId AND OwnsPage.`page` = in_pageId)
		THEN
			IF EXISTS
				(SELECT *
					FROM PostedOn
                    WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId AND PostedOn.`user` = in_userId)
			THEN
				DELETE FROM PostedOn
                WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId AND PostedOn.`user` = in_userId; 
				UPDATE `Page`
					SET `Page`.postCount = postCount - 1
					WHERE Post.postId = in_postId;
			END IF;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE DeleteGroupComment (IN in_pageId INT, IN in_groupId INT, IN in_userId INT, IN in_postId INT, IN in_commentId INT)
	BEGIN
    IF EXISTS
		(SELECT *
			FROM MemberOfGroup
			WHERE MemberOfGroup.`user` = in_userId AND MemberOfGroup.`group` = in_groupId)
    THEN 
		IF EXISTS
			(SELECT * 
				FROM OwnsPage
                WHERE OwnsPage.`group` = in_groupId AND OwnsPage.`page` = in_pageId)
		THEN
			IF EXISTS
				(SELECT *
					FROM PostedOn
                    WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId)
			THEN
				IF EXISTS
					(SELECT *
						FROM CommentedOn
                        WHERE CommentedOn.`comment` = in_commentId AND CommentedOn.`user` = in_userId AND CommentedOn.post = PostedOn.post)
				THEN
					DELETE FROM CommentedOn
					WHERE CommentedOn.`comment` = in_commentId AND CommentedOn.`user` = in_userId AND CommentedOn.post = PostedOn.post;
				END IF;
			END IF;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE EditGroupPost (IN in_pageId INT, IN in_groupId INT, IN in_userId INT, IN in_postId INT, IN in_content VARCHAR(250))
    BEGIN
    IF EXISTS
		(SELECT *
			FROM MemberOfGroup
			WHERE MemberOfGroup.`user` = in_userId AND MemberOfGroup.`group` = in_groupId)
    THEN 
		IF EXISTS
			(SELECT * 
				FROM OwnsPage
                WHERE OwnsPage.`group` = in_groupId AND OwnsPage.`page` = in_pageId)
		THEN
			IF EXISTS
				(SELECT *
					FROM PostedOn
                    WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId AND PostedOn.`user` = in_userId)
			THEN
				Update Post
					SET Post.content = in_content
					WHERE Post.postId = in_postId;
			END IF;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE EditGroupComment (IN in_pageId INT, IN in_groupId INT, IN in_userId INT, IN in_postId INT, IN in_commentId INT, IN in_content VARCHAR(250))
	BEGIN
    IF EXISTS
		(SELECT *
			FROM MemberOfGroup
			WHERE MemberOfGroup.`user` = in_userId AND MemberOfGroup.`group` = in_groupId)
    THEN 
		IF EXISTS
			(SELECT * 
				FROM OwnsPage
                WHERE OwnsPage.`group` = in_groupId AND OwnsPage.`page` = in_pageId)
		THEN
			IF EXISTS
				(SELECT *
					FROM PostedOn
                    WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId)
			THEN
				IF EXISTS
					(SELECT *
						FROM CommentedOn
                        WHERE CommentedOn.`comment` = in_commentId AND CommentedOn.`user` = in_userId AND CommentedOn.post = PostedOn.post)
				THEN
					UPDATE `Comment`
						SET `Comment`.content = in_content
						WHERE `Comment`.commentId = in_commentId;
				END IF;
			END IF;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE SearchForUser (IN in_regex VARCHAR(30), OUT out_personId INT)
	BEGIN
    SELECT personId
		FROM Person
        WHERE lastName LIKE '%in_regex%' OR firstName LIKE '%in_regex%';
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE PostOn(IN in_postId INT, IN in_pageId INT, IN in_userId INT)
	BEGIN
    IF EXISTS
		(SELECT * 
			FROM OwnsPage
			WHERE OwnsPage.`page` = in_pageId)
	THEN
		INSERT INTO PostedOn(post, `page`, `user`) VALUES (in_postId, in_pageId, in_userId);
		UPDATE `Page`
			SET `Page`.postCount = `Page`.postCount + 1
			WHERE `Page`.pageId = in_pageId;
	END IF;
    END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE CommentOn (IN in_pageId INT, IN in_userId INT, IN in_postId INT, IN in_commentId INT)
	BEGIN
	IF EXISTS
		(SELECT * 
			FROM OwnsPage
			WHERE OwnsPage.`page` = in_pageId)
	THEN
		IF EXISTS
			(SELECT *
				FROM PostedOn
				WHERE PostedOn.post = in_postID AND PostedOn.`page` = in_pageId)
		THEN
			INSERT INTO CommentedOn(`comment`, post, `user`) VALUES (in_commentId, in_postId, in_userId);
            UPDATE Post
			SET Post.commentCount = commentCount + 1
			WHERE Post.postId = in_postId;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE DeletePost (IN in_pageId INT, IN in_userId INT, IN in_postId INT)
	BEGIN
	IF EXISTS
		(SELECT * 
			FROM OwnsPage
			WHERE OwnsPage.`page` = in_pageId)
	THEN
		IF EXISTS
			(SELECT *
				FROM PostedOn
				WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId AND PostedOn.`user` = in_userId)
		THEN
			DELETE FROM PostedOn
			WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId AND PostedOn.`user` = in_userId; 
			UPDATE `Page`
				SET `Page`.postCount = postCount - 1
				WHERE Post.postId = in_postId;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE DeleteComment (IN in_pageId INT, IN in_userId INT, IN in_postId INT, IN in_commentId INT)
	BEGIN
	IF EXISTS
		(SELECT * 
			FROM OwnsPage
			WHERE OwnsPage.`owner` = in_userId AND OwnsPage.`page` = in_pageId)
	THEN
		IF EXISTS
			(SELECT *
				FROM PostedOn
				WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId)
		THEN
			IF EXISTS
				(SELECT *
					FROM CommentedOn
					WHERE CommentedOn.`comment` = in_commentId AND CommentedOn.`user` = in_userId AND CommentedOn.post = PostedOn.post)
			THEN
				DELETE FROM CommentedOn
				WHERE CommentedOn.`comment` = in_commentId AND CommentedOn.`user` = in_userId AND CommentedOn.post = PostedOn.post;
			END IF;
		END IF;
	END IF;
    END $$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE EditPost (IN in_pageId INT, IN in_userId INT, IN in_postId INT, IN in_content VARCHAR(250))
    BEGIN
		IF EXISTS
			(SELECT * 
				FROM OwnsPage
                WHERE OwnsPage.`owner` = in_userId AND OwnsPage.`page` = in_pageId)
		THEN
			IF EXISTS
				(SELECT *
					FROM PostedOn
                    WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId AND PostedOn.`user` = in_userId)
			THEN
				Update Post
					SET Post.content = in_content
					WHERE Post.postId = in_postId;
			END IF;
		END IF;
    END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE EditComment (IN in_pageId INT, IN in_userId INT, IN in_postId INT, IN in_commentId INT, IN in_content VARCHAR(250))
	BEGIN
	IF EXISTS
		(SELECT * 
			FROM OwnsPage
			WHERE OwnsPage.`owner` = in_userId AND OwnsPage.`page` = in_pageId)
	THEN
		IF EXISTS
			(SELECT *
				FROM PostedOn
				WHERE PostedOn.post = in_postId AND PostedOn.`page` = in_pageId)
		THEN
			IF EXISTS
				(SELECT *
					FROM CommentedOn
					WHERE CommentedOn.`comment` = in_commentId AND CommentedOn.`user` = in_userId AND CommentedOn.post = PostedOn.post)
			THEN
				UPDATE `Comment`
					SET `Comment`.content = in_content
					WHERE `Comment`.commentId = in_commentId;
			END IF;
		END IF;
	END IF;
    END $$
DELIMITER ;

