<img src="./public/logo.png" alt="webworm logo" width="42" align="left" />

# Webworm

Webworm is a blogging CMS built with Next.js, MongoDB and [Mantine ui theme](https:mantine.dev).

Webstorm uses `Next-auth` is used for authentication.

### env variables

| Variable                               | Description                                                                                                                             |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGO_URI`                            | MongoDb database url                                                                                                                    |
| `NEXTAUTH_URL`                         | base api url <br>For development: http:localhost:3000<br>for production: https://your-domain.com<br>**NOTE: DO NOT ADD TRAILING SLASH** |
| `NEXTAUTH_SECRET`                      | string for encoding JWT and next-auth token                                                                                             |
| `CLOUDINARY_API_KEY`                   |                                                                                                                                         |
| `CLOUDINARY_API_SECRET`                |                                                                                                                                         |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    |                                                                                                                                         |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Name of your upload preset                                                                                                              |

### Creating admin user

**NOTE: Ensure the env variable `MONGO_URI` is set before trying to create the admin user**

Creating the admin user is done through the `CLI`.

-   The file `createAdmin.mjs` in the root directory is setup to create an admin user for the CMS

-   The optional field is the database name in the variable `dbName` which by default is set to `webworm`

to create the user, in the root directory, run

```bash
 node createAdmin.mjs
```

and follow the prompts.

After creating the user, you can delete the `createAdmin.mjs` file if you wish to.

### Media Management

Webworm uses cloudinary for media management.

In your cloudinary console, create a folder called `webworm` where all assets will be stored.

create an upload preset in the settings and store the name of the preset in the env variables as `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. This will be used to upload media to cloudinary.
