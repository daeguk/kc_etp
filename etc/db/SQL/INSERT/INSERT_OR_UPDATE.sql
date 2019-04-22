INSERT INTO students (NAME, email) VALUES ('saltfactory', 'saltfactory@gmail.com')  
ON DUPLICATE KEY UPDATE name='saltfactory', email='saltfactory@me.com';  