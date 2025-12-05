CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitors INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    forms INTEGER DEFAULT 0
);

INSERT INTO stats (visitors, views, forms) VALUES (0, 0, 0);

-- CRÉER TON COMPTE ADMIN (email + mot de passe hashé)
INSERT INTO admins (email, password)
VALUES ('gabrieldurand707@gmail.com', 'Admin123');
