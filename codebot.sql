CREATE TABLE IF NOT EXISTS `ncodes` (
  `code` varchar(24) NOT NULL DEFAULT '',
  `type` varchar(50) NOT NULL,
  `amount` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;