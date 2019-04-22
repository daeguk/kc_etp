CREATE TABLE `M001UETPINSTCODE` (
`id`	VARCHAR(15)	PRIMARY KEY COMMENT	'ID',
`user_type`	CHAR(4)	COMMENT	'참여자구분코드',
`inst_cd`	CHAR(5)	COMMENT	'발행기관구분코드',
`inst_nm`	VARCHAR(40)	COMMENT	'발행기관명',
`user_nm`	VARCHAR(40)	COMMENT	'담당자명',
`user_pos`	VARCHAR(40)	COMMENT	'담당자직책',
`tel_no`	VARCHAR(40)	COMMENT	'회사전화번호',
`cel_no`	VARCHAR(40)	COMMENT	'휴대폰',
`email`	VARCHAR(40)	COMMENT	'이메일',
`comment`	VARCHAR(200)	COMMENT	'설명'
) ENGINE=INNODB DEFAULT CHARSET=utf8 COMMENT='M001UETPINSTCODE';
