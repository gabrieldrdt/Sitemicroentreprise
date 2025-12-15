FROM php:8.2-cli

# Installer SQLite
RUN apt-get update && \
    apt-get install -y sqlite3 libsqlite3-dev pkg-config && \
    docker-php-ext-install pdo pdo_sqlite

WORKDIR /var/www/html

COPY api/ api/
COPY db/ db/

# Render définit $PORT automatiquement
ENV PORT=10000

# Instruction de démarrage dynamique
CMD ["php", "-S", "0.0.0.0:10000", "-t", "/var/www/html"]
