CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title)
VALUES (
  'Dan Abramov',
  'https://overreacted.io/on-let-vs-const/',
  'On let vs const'
);

INSERT INTO blogs (author, url, title, likes)
VALUES (
  'Matti Luukkainen',
  'https://fullstackopen.com/en/',
  'Kun MOOCit Helsingin yliopistoon tulivat',
  5
);