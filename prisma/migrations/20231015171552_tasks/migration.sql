-- CreateTable
CREATE TABLE `Categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(250) NOT NULL,
    `description` VARCHAR(250) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `status` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(250) NOT NULL,
    `description` VARCHAR(250) NOT NULL,
    `categories_id` INTEGER NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `due_date` DATE NOT NULL,
    `priority` VARCHAR(100) NOT NULL,
    `comments` VARCHAR(250) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
