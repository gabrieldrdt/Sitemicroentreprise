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
VALUES ('gabrieldurand707@gmail.com', '59b0844e98063e4a810dd014c553fd09081aae3fdb5ab919260c67af2abb357b');
