Welcome to the Wake app server side!

To run service locally:
1. Install [node.js](https://nodejs.org/en/)
2. Install latest [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
3. On PostgreSQL server, create a new database for this service
4. Make sure `.env` file matches your database setup
5. Install npm packages with terminal command `npm install` 
6. Run database migrations with terminal command `npm run typeorm migration:run`

If you changed/created database entity classes, you need to create a new migration script with this terminal command (replace migration name):
```
npm run typeorm migration:generate -- -n appropriateMigrationName
```