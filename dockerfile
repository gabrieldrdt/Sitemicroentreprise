FROM php:8.2-cli

# Installer SQLite
RUN docker-php-ext-install pdo pdo_sqlite

# Copier API + base de données
WORKDIR /var/www/html
COPY api/ api/
COPY db/ db/

# Lancer serveur PHP
CMD ["php", "-S", "0.0.0.0:10000", "-t", "api"]
