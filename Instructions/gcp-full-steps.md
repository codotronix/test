# CREATE A PROJECT
    - Create the project
    - Select the project

# ENABLE FIRESTORE
    - Select firestore native

# DOWNLOAD SERVICE ACCOUNT KEYS JSON
    - Go to `Service Accounts` inside `IAM & Admin`
    - Click on an email or create one
    - Under `keys` tab, click on ADD KEY
    - Put the downloaded json file under secrets/gcp folder of this project root folder
    - From the json file fill the appropriate details (project id, path to secret file) in `server.js`
    ```
    // FOR FIRESTORE
    initFirestore('reactale-2', path.join(__dirname, 'secrets', 'gcp', 'reactale-2-c8f3a5d01201.json'))
    ```

# CREATE CLOUD STORAGE BUCKET
    - Go to cloud storage
    - Create a bucket e.g. `reactale-story-banner-dev-1`
    - Select bucket > Permissions > add user as allUser > role as legacy-object-reader-without-listing (something like that)

# BUILD DOCKER IMAGE IN CLOUD BUILD 
    - Go to Cloud Build
    - Triggers > Create Trigger
    - Fill up the form
    - Use github mirrored legacy (if it fails, restart browser and try again)
    - Give branch name as regex e.g `^development$`
    - Select Dockerfile, create ...
    - Go to Settings > View API > ENABLE Cloud Build
    - Push anything to development branch to see the trigger working

# CLOUD RUN
    - go to Cloud Run
    - Create Service
    - Select container image from what you just built above in Cloud Build
    - Go to Advance
    - Give port 9090, that's where our node server runs
    - Increase memory to 512
    - Under Variables Tab, set environment variables, (Change env to dev or prod)
        ```
            URL = https://reactale.site
            GCP_PROJECT_ID = reactale
            GOOGLE_APPLICATION_CREDENTIALS = ./secrets/gcp/reactale-ce90eddb79d6.json
            TALE_BANNER_BUCKET = reactale-story-banner
            ENV = dev
        ```
    - NEXT > Under Authentication > Allow unauthenticated invocations (because it's a public website)
    - Hit CREATE

    ** WE ARE DONE **


--------------------------------------------------------------------------

# NEW STEPS

## Deploy The FE WebApp
- Open gcp console
- Git clone the reactale-v2 codebase
- Go inside fe and do `npm i`, and then `npm run build` or `npm run build-dev` depending on `prod` or `dev`
- Copy the content of build folder to GCP bucket named **webapp.reactale.com** with the following command
    ```
    gsutil -m cp -r ./fe/build/* gs://webapp.reactale.com/r/
    
    // or for dev
    gsutil -m cp -r ./fe/build/* gs://webapp.reactale.site/r/
    ```

## Copy the Assets to WebApp Bucket
- Copy the content of the folder named **assets-root** to directly under **webapp.reactale.com** bucket, with the following command
```
    gsutil -m cp -r ./assets-root/* gs://webapp.reactale.com/

    // or for dev
    gsutil -m cp -r ./assets-root/* gs://webapp.reactale.site/
```

## Set proper CORS to GCP Bucket
    Chrome cannot load fonts from GCP buckets, if CORS is not done

- Set CORS on **webapp.reactale.com** bucket with the followig command
```
    gsutil cors set ./Instructions/cors_gcp_bucket.json gs://webapp.reactale.com

    // or for dev
    gsutil cors set ./Instructions/cors_gcp_bucket.json gs://webapp.reactale.site
```