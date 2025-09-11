# Developer's Society: Selection Tasks

_**Under construction 🏗️**_

## Task 1: Lost and Found API

Task summary ... My take on it.

- We need a admin panel for this thing too for database handling ... will user adminjs for this purpose.

Why do we need the login setup again ... ? So that the admins can moderate the listings ... and do the users need to login?? Well ... I'll make a login setup for everyon but the login taken is to be role based ... something like Bearer 'role' hash ...

- need to make admin functions for db moderation (using adminjs would've been easier)
- make items endpoints.

## For Local Testing

**Clone the repo first, get into the repo directory and run the following commands in terminal:**

```bash
cd task1

#run the backend (:5000)
docker compose up --build

# run the frontend (:5173)
cd frontend
npm install
npm run dev
```

in the browser go to this link http://localhost:5173

- login using the credentials of admin: `"admin"` and `"password123"`

You can see the list of all the pre-fed data for items and users.

- you can also create/edit/delete the entries, for now the create/edit modals have this bug of rerendering on each keypress.
- you can also see the users list with the password has ( this list is only visible to suers with the "admin" role.

## TODO

- apply backend endpoints to the frontend for relevant functioning
- fix the docker compose issue of building for the first time and backend trying to connect before db is setup
- date filter needs a calender widget to properly provide a date value otherwise it'll fuck with the useEffect hook.
- also, make the entry DELETE, CREATE, UPDATE setup (delete is fairly simple, need a modal for other two) (prolly add update n delete in teh actions col of the table, and new on tehe same line as apply filter .. but on the left side)
- also make a delete all function ... cuz why not!! (admin only)
- user db api call required ... setup controllers for this shit (some shit is wrong here)
- fix this weird bug where the create new modal just doesnt take values normally (giving up for now)
