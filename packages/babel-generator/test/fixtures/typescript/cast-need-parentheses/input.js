(<T> x).y;
(x as T).y;
x!.y;

(point1 ?? point2 as Point);
(point1 ?? point2) as Point;

a in b as c;
(a in b) as c;
a in (b as c);
a as b in c;
(a as b) in c;

a | b as c;
(a | b) as c;
a | (b as c);
a as b | c;
(a as b) | c;
a as (b | c);

a as b || c;
(a as b) || c;

a as b[0];
a as (b[0]);
(a as b)[0];

(a as b) = c;
[a as b] = c;
[(a as b) = c] = d;
