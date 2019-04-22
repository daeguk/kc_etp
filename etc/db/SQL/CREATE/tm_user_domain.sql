CREATE TABLE `tm_user_domain` (
	`type_cd` CHAR(4) NOT NULL COMMENT '사용자 그룹 코드',
  `inst_cd` CHAR(5) NOT NULL COMMENT '기관구분코드',
	`inst_name` VARCHAR(40) NOT NULL COMMENT '기관명',
	`domain` VARCHAR(40) NULL DEFAULT NULL COMMENT '도메인명'
	PRIMARY KEY (`type_cd`,`inst_cd`)  
) ENGINE=INNODB DEFAULT CHARSET=utf8 COMMENT='tm_user_domain';

