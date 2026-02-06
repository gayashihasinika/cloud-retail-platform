FROM php:8.3-fpm

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# 2. Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 3. Working directory
WORKDIR /var/www

# 4. Copy project files
COPY . .

# 5. Vendor folders
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# 6. Port 8000 open
EXPOSE 8001

# 7. Server start
CMD php artisan serve --host=0.0.0.0 --port=8001