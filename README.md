<h2>Site References</h2>
MERN setup: https://www.mongodb.com/languages/mern-stack-tutorial

Mongoose: https://mongoosejs.com/docs/

Material UI: https://mui.com/

<h2>Commands to Set up from Cloned Repo</h3>
1. Install all packages by running the following command in the main folder "is4103_project":

```bash
npm run setup
```

2. Start all projects(server, client-frontend, admin-frontend) by running the following command in the main folder "is4103_project":

```bash
npm run dev
```

3. To run just the backend server, access folder "server" and run the following command:

```bash
node server.js
```

<h2>Commands to Format and Run Project </h2>
1. To format using prettier from respective folders run the following command:

```bash
npm run format
```

2. To check format using prettier from respective folders run the following command:

```bash
npm run check
```

3. To run project from respective folders run the following commmand:

```bash
npm start
```

<h3> Packages Installed for Respective Folder (Don't need to run) </h3>

1. "is4103_project" folder

   1. npm install concurrently (to run all projects at once)
   2. npm install --save-dev husky pretty-quick (auto format code when committing)

2. "server" folder

   1. npm install express cors dotenv mongodb mongoose (external libraries required for backend)
   2. npm install --save-dev prettier (to format code)

3. "client-frontend" and "admin-frontend" folder
   1. npm install zustand axios (external libraries required for frontend state and http function)
   2. npm install @mui/material @emotion/react @emotion/styled @mui/icons-material (design library)
   3. npm install --save-dev prettier (to format code)
