\# Movie Rating App



A full-stack movie rating and review app built with Vue.js, Node.js, and MySQL. Movie data is fetched from the \[TMDB API](https://www.themoviedb.org/documentation/api).



\*\*Live site:\*\* \[movierateap.netlify.app](https://movierateap.netlify.app)

\*\*Live backend:\*\* \[movie-rating-app-backend-p66o.onrender.com](https://movie-rating-app-backend-p66o.onrender.com)



\## Features



\- Browse and search movies

\- Hero carousel on the homepage

\- User registration, login, and session management

\- Rate movies (1–5 stars)

\- Community rating summary per movie (average + total count)

\- Add and view movie reviews

\- Responsive design with Bootstrap 5



\## Tech Stack



| Layer | Technologies |

|---|---|

| Frontend | Vue.js 3, Vuex, Vue Router, Axios, Bootstrap 5 |

| Backend | Node.js, REST API |

| Database | MySQL |

| Deployment | Netlify (frontend), Render (backend) |



\## Project Structure



```

MovieRatingApp/

├── backend/

│   ├── server/index.js

│   ├── database/schema.sql

│   ├── .env.example

│   └── package.json

├── frontend/

│   ├── src/

│   ├── public/

│   └── vue.config.js

├── netlify.toml

└── package.json

```



\## Local Setup



\### 1. Clone the repo



```bash

git clone https://github.com/Zang10/Movie-Rating-App.git

cd Movie-Rating-App

```



\### 2. Install dependencies



```bash

npm install

```



\### 3. Create `backend/.env`



```env

MYSQL\_HOST=127.0.0.1

MYSQL\_PORT=3306

MYSQL\_USER=root

MYSQL\_PASSWORD=your\_password

MYSQL\_DATABASE=movie\_rating\_app

API\_PORT=3001

```



\### 4. Set up the database



```bash

mysql -u root -p movie\_rating\_app < backend/database/schema.sql

```



\### 5. Start the backend



```bash

npm run api

```



Runs at `http://localhost:3001`



\### 6. Start the frontend



```bash

npm run serve

```



Runs at `http://localhost:8080`



\## API Endpoints



| Method | Endpoint | Description |

|---|---|---|

| POST | `/api/auth/register` | Register a new user |

| POST | `/api/auth/login` | Log in |

| GET | `/api/auth/me` | Get the current user |

| POST | `/api/auth/logout` | Log out |

| GET | `/api/ratings/:movieId` | Rating summary + the user's rating |

| PUT | `/api/ratings/:movieId` | Submit or update a rating |

| GET | `/api/reviews/:movieId` | Get reviews for a movie |

| POST | `/api/reviews/:movieId` | Add a review |

| GET | `/api/health` | Health check |



\## Security



\- Passwords hashed with `crypto.scrypt`

\- Sessions managed server-side with secure cookies

\- Credentials stored in environment variables only

\- Production MySQL uses SSL



\## Deployment



\- \*\*Frontend:\*\* deployed on Netlify

\- \*\*Backend:\*\* deployed on Render (root: `backend/`, start: `npm run start`)

\- Netlify proxies `/api/\*` to the Render backend via `netlify.toml`



\## Author



\*\*Kuenzang Jamtsho\*\*

GitHub: \[@Zang10](https://github.com/Zang10)

