To start the database, make sure that the docker is running
Then write the command

```
npm run db:dev:u
```

It will create the container for the docker and run it.

Then to make migration through Prisma use

```
npm run dev:migration
```

and to deploy the migration run

```
npm run prisma:dev:deploy
```

It will make the changes to the database
To run the Prisma studio to see the database run

```
npm run prisma:studio
```

To restart the docket instance run

```
npm run db:dev:restart
```

To run the application 

```
npm run dev
```

It will launch the application on localhost:3000
