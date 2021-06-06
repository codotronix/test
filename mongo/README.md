# MongoDB Setup Details

This folder will contain all the details required for setup, backup and configuration of MongoDB for Reactale

## Monitoring / Inspecting Data

use Atlas to monitor mongodb collections and data. It's awesome.

## BACKUPS

- use `mongodump` and `mongorestore` for saving and restoring backups. **Don't use** `mongoexport` and `mongoimport` commands for full instance production backups. They do not reliably preserve all rich BSON data types, because JSON can only represent a subset of the types supported by BSON. See the **WARNING SECTION** of this answer
[mongodump vs mongoexport](https://dba.stackexchange.com/questions/194370/what-is-difference-between-mongodump-and-mongoexport/194373#194373)

- Open cmd / terminal. `cd` to the folder where you want to save the dump. Type `mongodump` and press enter.

- Keep copies of local dumps separated from prod dumps




