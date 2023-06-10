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

- The file `createAdmin.mjs` in the root directory is setup to create an admin user for the CMS

- The optional field is the database name in the variable `dbName` which by default is set to `webworm`

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

---

## Routes

- All routes for the admin panel are under the '/api/admin' routes

- All routes for the api are under the '/api/vo' routes

### Admin routes

**These are the routes being used internally by the CMS.**
<br>

#### Generate API Key for use by client

| Route                    | Method | Data                    |
| ------------------------ | ------ | ----------------------- |
| `/api/admin/apiKey`      | GET    | Fetch all api keys      |
| `/api/admin/apiKey`      | POST   | Generate new api key    |
| `/api/admin/apiKey/[id]` | DELETE | Delete selected api key |

<br>

#### Fetch and delete media from cloudinary

| Route                   | Method | Data                                   |
| ----------------------- | ------ | -------------------------------------- |
| `/api/admin/media`      | GET    | Get media for display in media manager |
| `/api/admin/media/[id]` | DELETE | Delete media from cloudinary           |

<br>

#### Manage posts

| Route                     | Method | Data                       | Query Params                                                                                                                                                                                                                             |
| ------------------------- | ------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/admin/posts`        | GET    | Get all posts              | - page (current page to fetch)<br> - filter(post publish status: published or unpublished: exclude filter to get all posts)<br> -search (search string: search for post using title) <br><br> `/api/admin/posts?page=1&status=published` |
| `/api/admin/posts`        | POST   | Create new post            |                                                                                                                                                                                                                                          |
| `/api/admin/posts/[slug]` | GET    | Get single post using slug |                                                                                                                                                                                                                                          |
| `/api/admin/posts/[slug]` | PATCH  | Update a post              |                                                                                                                                                                                                                                          |
| `/api/admin/posts/[slug]` | DELETE | Delete post                |                                                                                                                                                                                                                                          |

<br>

#### User details

| Route                       | Method | Data                |
| --------------------------- | ------ | ------------------- |
| `/api/admin/users/[userId]` | PATCH  | Update user details |

<br>

#### Privacy Policy

| Route               | Method | Data                  |
| ------------------- | ------ | --------------------- |
| `/api/admin/policy` | GET    | Get privacy policy    |
| `/api/admin/policy` | PATCH  | Update privacy policy |

<br>

#### Terms and Conditions

| Route              | Method | Data                        |
| ------------------ | ------ | --------------------------- |
| `/api/admin/terms` | GET    | Get Terms and Conditions    |
| `/api/admin/terms` | PATCH  | Update Terms and Conditions |

<br>
<br>
<br>

### Client API routes

- These are the routes the blog client will use to fetch data from the CMS.
- ensure the api key is added to the client api call headers using:

```bash
headers: {
    "x-api-key": <API KEY>
}
```

| Route                  | Method | Data                      |
| ---------------------- | ------ | ------------------------- |
| `/api/v0/posts`        | GET    | Fetch all published posts |
| `/api/v0/posts/[slug]` | GET    | Fetch single post         |
| `/api/v0/policy`       | GET    | Get privacy policy        |
| `/api/v0/terms`        | GET    | Get Terms and Conditions  |

The `/api/v0/posts` can have the following query params:

- page : The page number to fetch.
  - **If not provided, the default is `1`**
- per_page : The total posts to return per page.
  - **If not provided, the default is `10`**
- search : The search string to search for posts

#### Example

`/api/v0/posts?page=2&per_page=20` will return posts in the second page with 20 posts per page
