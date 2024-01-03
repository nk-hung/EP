-- 1. USER --
DROP TABLE IF EXISTS `gnuh_user`;
CREATE TABLE `gnuh_user`(
user_id int NOT NULL AUTO_INCREMENT COMMENT 'user id',
user_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'user name',
user_email VARCHAR(255) NULL DEFAULT NULL COMMENT 'user email',
PRIMARY KEY (`user_id`)
) ENGINE = INNODB CHARACTER SET=`utf8mb4`;

-- run mock DATA
INSERT INTO `gnuh_user` VALUES (1, 'u_admin', 'admin@gmail.com');
INSERT INTO `gnuh_user` VALUES (2, 'u_role', 'role@gmail.com');
INSERT INTO `gnuh_user` VALUES (3, 'u_user', 'user@gmail.com');

-- 2. ROLE --
DROP TABLE IF EXISTS `gnuh_role`;
CREATE TABLE `gnuh_role` (
role_id INT NOT NULL AUTO_INCREMENT COMMENT 'role id',
role_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'role name',
role_description VARCHAR(255) NULL DEFAULT NULL COMMENT 'role description',
PRIMARY KEY (`role_id`)
) ENGINE = INNODB CHARACTER SET='utf8md4';

-- run mock DATA
INSERT INTO gnuh_role VALUES (1, 'admin', 'read, create, delete, update');
INSERT INTO gnuh_role VALUES (2, 'shop', 'read, create, update');
INSERT INTO gnuh_role VALUES (3, 'user', 'read');

-- 3. MENU --
DROP TABLE IF EXISTS `gnuh_menu`;
CREATE TABLE `gnuh_menu` (
menu_id INT NOT NULL AUTO_INCREMENT COMMENT 'menu id',
menu_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'menu name',
menu_pid VARCHAR(255) NULL DEFAULT NULL COMMENT 'menu product id',
menu_path VARCHAR(255) NULL DEFAULT NULL COMMENT 'menu path',
PRIMARY KEY (`menu_id`)
) ENGINE = INNODB CHARACTER SET = 'utf8md4';

-- run mock DATA
INSERT INTO gnuh_menu VALUES (1, 'Dong ho', '11036030', 'Điện-Thoại-Phụ-Kiện-cat.11036030');
INSERT INTO gnuh_menu VALUES (2, 'Laptop', '11035954', 'Máy-Tính-Laptop-cat.11035954');
INSERT INTO gnuh_menu VALUES (3, 'Giày Dép Nam', '11035801', 'Giày-Dép-Nam-cat.11035801');

-- 4. ROLE MENU --
-- gan menu cho cac role tuong ung? VD: dong ho, laptop, giay dep name cho role admin, laptop cho role shop
DROP TABLE IF EXISTS `gnuh_role_menu`;
CREATE TABLE `gnuh_role_menu` (
role_id INT NOT NULL COMMENT 'role id',
menu_id INT NOT NULL COMMENT 'menu id',
PRIMARY KEY (`role_id`, `menu_id`)
) ENGINE = INNODB CHARACTER SET = 'utf8md4';

INSERT INTO gnuh_role_menu VALUES (1, 7);
INSERT INTO gnuh_role_menu VALUES (1, 8);
INSERT INTO gnuh_role_menu VALUES (1, 9);
INSERT INTO gnuh_role_menu VALUES (2, 8);
INSERT INTO gnuh_role_menu VALUES (2, 9);

-- 5. USER ROLE --
DROP TABLE IF EXISTS `gnuh_user_role`;
CREATE TABLE `gnuh_user_role` (
user_id INT NOT NULL COMMENT 'user id',
role_id INT NOT NULL COMMENT 'role id',
PRIMARY KEY (`user_id`, `role_id`)
) ENGINE = INNODB CHARACTER SET = 'utf8md4';

-- mock DATA
INSERT INTO gnuh_user_role VALUES (1, 1);
INSERT INTO gnuh_user_role VALUES (2, 2);
INSERT INTO gnuh_user_role VALUES (3, 3);
