-- CreateTable
CREATE TABLE `ClothingItem` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `category` ENUM('FEMININO', 'MASCULINO', 'INFANTIL', 'ACESSORIO', 'UNISSEX') NOT NULL DEFAULT 'UNISSEX',
    `imagePath` VARCHAR(500) NULL,
    `sizes` VARCHAR(240) NULL,
    `color` VARCHAR(120) NULL,
    `dailyPrice` DECIMAL(10, 2) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClothingItem_slug_key`(`slug`),
    INDEX `ClothingItem_active_category_sortOrder_idx`(`active`, `category`, `sortOrder`),
    INDEX `ClothingItem_featured_sortOrder_idx`(`featured`, `sortOrder`),
    INDEX `ClothingItem_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
