/*
 Navicat Premium Dump SQL

 Source Server         : localtest
 Source Server Type    : MySQL
 Source Server Version : 80037 (8.0.37)
 Source Host           : localhost:3306
 Source Schema         : voting_election

 Target Server Type    : MySQL
 Target Server Version : 80037 (8.0.37)
 File Encoding         : 65001

 Date: 26/04/2025 19:29:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for candidates
-- ----------------------------
DROP TABLE IF EXISTS `candidates`;
CREATE TABLE `candidates`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_name_description`(`name` ASC, `description` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of candidates
-- ----------------------------
INSERT INTO `candidates` VALUES (1, '小滨', '程序员', '2025-04-25 09:57:29', '2025-04-25 10:03:45');
INSERT INTO `candidates` VALUES (2, '大滨', '后端程序员', '2025-04-25 10:04:50', '2025-04-25 10:04:50');

-- ----------------------------
-- Table structure for elections
-- ----------------------------
DROP TABLE IF EXISTS `elections`;
CREATE TABLE `elections`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT 0,
  `start_time` datetime NULL DEFAULT NULL,
  `end_time` datetime NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_title_description_isactive`(`title` ASC, `description` ASC, `is_active` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of elections
-- ----------------------------
INSERT INTO `elections` VALUES (1, '优秀程序员111', '选一位优选的程序员111', 0, '2025-04-25 11:28:06', '2025-04-25 11:33:16', '2025-04-25 10:17:35', '2025-04-26 19:23:48');
INSERT INTO `elections` VALUES (2, '优秀程序员222', '选一位优选的程序员222', 0, '2025-04-25 10:24:56', '2025-04-25 10:50:34', '2025-04-25 10:24:56', '2025-04-25 10:50:34');
INSERT INTO `elections` VALUES (3, '优秀程序员333', '选一位优选的程序员333', 1, '2025-04-25 10:52:09', '2025-04-26 06:52:09', '2025-04-25 10:52:09', '2025-04-25 10:52:09');
INSERT INTO `elections` VALUES (4, '优秀程序员444', '选一位优选的程序员444', 1, '2025-04-25 12:12:32', '2025-04-26 08:12:32', '2025-04-25 12:12:32', '2025-04-25 12:12:32');
INSERT INTO `elections` VALUES (5, '优秀程序员555', '选一位优选的程序员555', 1, '2025-04-26 05:17:06', '2025-04-27 01:17:06', '2025-04-26 05:17:06', '2025-04-26 05:17:06');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_verified` tinyint UNSIGNED NOT NULL DEFAULT 0,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `verification_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `code_expires_at` datetime NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uiq_email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '2192559956@qq.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, 1, '', NULL, '2025-04-25 08:37:44', '2025-04-25 21:17:01');

-- ----------------------------
-- Table structure for vote
-- ----------------------------
DROP TABLE IF EXISTS `vote`;
CREATE TABLE `vote`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `candidate_id` int NOT NULL,
  `election_id` int NOT NULL,
  `voted_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_userid_candidateid_electionid`(`user_id` ASC, `candidate_id` ASC, `election_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of vote
-- ----------------------------
INSERT INTO `vote` VALUES (1, 1, 1, 2, '2025-04-25 10:32:00', '2025-04-25 10:32:00', '2025-04-25 10:32:00');
INSERT INTO `vote` VALUES (2, 1, 1, 3, '2025-04-25 10:53:35', '2025-04-25 10:53:35', '2025-04-25 10:53:35');
INSERT INTO `vote` VALUES (3, 1, 2, 3, '2025-04-25 10:53:35', '2025-04-25 10:53:35', '2025-04-25 10:53:35');
INSERT INTO `vote` VALUES (4, 1, 1, 4, '2025-04-25 12:17:24', '2025-04-25 12:17:24', '2025-04-25 12:17:24');
INSERT INTO `vote` VALUES (5, 1, 2, 4, '2025-04-25 12:17:24', '2025-04-25 12:17:24', '2025-04-25 12:17:24');

SET FOREIGN_KEY_CHECKS = 1;
