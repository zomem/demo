/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80026
 Source Host           : localhost:3306
 Source Schema         : bidu

 Target Server Type    : MySQL
 Target Server Version : 80026
 File Encoding         : 65001

 Date: 22/12/2021 13:18:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS bidu;
CREATE DATABASE bidu;
SHOW databases;
use bidu;
show TABLES;
-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS articles;
CREATE TABLE articles (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(255) DEFAULT NULL,
  cover_url varchar(255) DEFAULT NULL,
  created_at datetime DEFAULT NULL,
  uid int DEFAULT NULL,
  status tinyint DEFAULT '2',
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of articles
-- ----------------------------
BEGIN;
INSERT INTO articles VALUES (1, 'g', '/articles/bEyy1ki77DdV5a965ba643e01e8fc7d2fff359fa1118.jpg', '2021-10-06 18:09:05', 2, 2);
INSERT INTO articles VALUES (2, '标题', '/articles/6SXE7oaYrjtu2559aff9f4ce8a2cccd47cf56bd0223b.jpg', '2021-10-06 18:12:14', 2, 2);
INSERT INTO articles VALUES (3, '66', '/articles/3a9aK1uDfJx555980828a8c9dca15176b98c246bd537.jpg', '2021-12-22 13:15:10', 3, 2);
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  nickname varchar(255) DEFAULT NULL,
  avatar varchar(255) DEFAULT NULL,
  openid varchar(255) DEFAULT NULL,
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO users VALUES (2, 'wzj', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKPt8nLhz9pbeyWICA0mx2615icImn4SiaqfMia6FdibEawA8vTziarcuoKpRkNOD6e0rcCIH72ibpxiaQ8A/132', 'oOqoN0SbAPfCL96HDfQGNCZZj8cw', '2021-10-06 15:53:03', '2021-10-07 09:17:33');
INSERT INTO users VALUES (3, 'wzj', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKPt8nLhz9pbeyWICA0mx2615icImn4SiaqfMia6FdibEawA8vTziarcuoKpxF1B9TlgsibYkgUwY2oiaibMQ/132', '', '2021-12-22 13:12:50', '2021-12-22 13:12:50');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
