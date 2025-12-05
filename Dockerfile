FROM php:8.2-cli

# Installer les dépendances nécessaires pour pdo_sqlite
RUN apt-get update && \
    apt-get install -y sqlite3 libsqlite3-dev pkg-config && \
    docker-php-ext-install pdo pdo_sqlite

# Répertoire de travail
WORKDIR /var/www/html

# Copier API + base SQLite
COPY api/ api/
COPY db/ db/

# Exposer port Render
EXPOSE 10000

# Lancer le serveur PHP
CMD ["php", "-S", "0.0.0.0:10000", "-t", "api"]
