FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Set working directory
WORKDIR /var/www

# Copy composer.lock and composer.json
COPY composer.lock composer.json /var/www/

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install dependencies
RUN composer install --no-dev --no-scripts --no-autoloader

# Copy project files
COPY . /var/www

# Install autoload
RUN composer dump-autoload

# Expose port 8001
EXPOSE 8001

# Run Laravel server
CMD php artisan serve --host=0.0.0.0 --port=8001
