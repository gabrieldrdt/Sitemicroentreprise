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

INSERT INTO admins (email, password)
VALUES ('gabrieldurand707@gmail.com', '0192023a7bbd73250516f069df18b500');
