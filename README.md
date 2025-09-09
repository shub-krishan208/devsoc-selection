# Developer's Society: Selection Tasks

_**Under construction 🏗️**_

## Task 1: Lost and Found API

Task summary ... My take on it.

- We need a admin panel for this thing too for database handling ... will user adminjs for this purpose.

Why do we need the login setup again ... ? So that the admins can moderate the listings ... and do the users need to login?? Well ... I'll make a login setup for everyon but the login taken is to be role based ... something like Bearer 'role' hash ...

- need to make admin functions for db moderation (using adminjs would've been easier)
- make items endpoints.

## TODO

- apply backend endpoints to the frontend for relevant functioning
- fix the docker compose issue of building for the first time and backend trying to connect before db is setup
- date filter needs a calender widget to properly provide a date value otherwise it'll fuck with the useEffect hook.
- also, make the entry DELETE, CREATE, UPDATE setup (delete is fairly simple, need a modal for other two) (prolly add update n delete in teh actions col of the table, and new on tehe same line as apply filter .. but on the left side)
- also make a delete all function ... cuz why not!! (admin only)
