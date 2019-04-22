CREATE TABLE `tm_user_member` (
  `type_cd` CHAR(4) NOT NULL COMMENT '사용자 그룹 코드',
  `inst_cd` CHAR(5) NOT NULL COMMENT '기관구분코드',
  `email` VARCHAR(40) NOT NULL COMMENT '이메일',
  `name` VARCHAR(40) NOT NULL COMMENT '이름',
  `password` VARCHAR(20) NOT NULL COMMENT '비밀번호',
  `hp_no` VARCHAR(20) DEFAULT NULL COMMENT '핸드폰 번호',
  `tel_no` VARCHAR(20) DEFAULT NULL COMMENT '사무실 전화번호',
  `emailchk` CHAR(1) DEFAULT 'N' COMMENT '이메일 인증여부',
  `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `login_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`type_cd`,`inst_cd`, `email`)  
) ENGINE=INNODB DEFAULT CHARSET=utf8 COMMENT='tm_user_member';
