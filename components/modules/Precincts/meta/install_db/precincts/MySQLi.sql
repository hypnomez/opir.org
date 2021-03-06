CREATE TABLE IF NOT EXISTS `[prefix]precincts` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`number` varchar(10) NOT NULL,
	`address_uk` text NOT NULL,
	`address_en` text NOT NULL,
	`address_ru` text NOT NULL,
	`lat` float NOT NULL,
	`lng` float NOT NULL,
	`district` int(10) unsigned NOT NULL,
	`violations` int(10) unsigned NOT NULL,
	PRIMARY KEY (`id`),
	KEY `number` (`number`),
	KEY `district` (`district`),
	KEY `violations` (`violations`),
	FULLTEXT KEY `address` (`address_uk`),
	FULLTEXT KEY `address` (`address_en`),
	FULLTEXT KEY `address` (`address_ru`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `[prefix]precincts_streams` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`precinct` int(10) unsigned NOT NULL,
	`user` int(10) unsigned NOT NULL,
	`added` bigint(20) unsigned NOT NULL,
	`stream_url` varchar(1024) NOT NULL,
	`status` tinyint(1) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `precinct` (`precinct`),
	KEY `new` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `[prefix]precincts_violations` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`precinct` int(10) unsigned NOT NULL,
	`user` int(10) unsigned NOT NULL,
	`date` bigint(20) NOT NULL,
	`text` text NOT NULL,
	`images` text NOT NULL COMMENT 'JSON array',
	`video` varchar(1024) NOT NULL,
	`status` tinyint(1) NOT NULL,
	`location` varchar(255) NOT NULL,
	`device_model` varchar(2014) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `precinct` (`precinct`),
	KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `[prefix]precincts_violations_feedback` (
	`id` int(11) NOT NULL COMMENT 'Violation id',
	`user` int(11) NOT NULL,
	`value` int(1) NOT NULL,
	PRIMARY KEY (`id`,`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
