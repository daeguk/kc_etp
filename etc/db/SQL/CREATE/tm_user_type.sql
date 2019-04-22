CREATE TABLE `tm_user_type` (
	`type_cd` CHAR(4) NOT NULL COMMENT '사용자 그룹 코드',
	`type_name` VARCHAR(40) NOT NULL COMMENT '사용자 그룹명',
PRIMARY KEY (`type_cd`)  
) ENGINE=INNODB DEFAULT CHARSET=utf8 COMMENT='tm_user_type';
