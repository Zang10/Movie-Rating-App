# RateFlix - Movie Rating App

RateFlix is a Vue.js application that allows users to browse movies, view details, and submit reviews. The app uses The Movie Database (TMDB) API to fetch movie data.

## Features

- Browse popular movies
- View detailed movie information
- User authentication
- Submit and view movie reviews
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd rateflix
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your TMDB API credentials:
```
VUE_APP_TMDB_API_KEY=your_api_key
VUE_APP_TMDB_ACCESS_TOKEN=your_access_token
```

4. Start the development server:
```bash
npm run serve
```

The application will be available at `http://localhost:8080`

## Demo Credentials

For testing purposes, you can use the following credentials:
- Username: user
- Password: password

## Technologies Used

- Vue.js 3
- Vuex
- Vue Router
- Bootstrap 5
- Axios
- The Movie Database (TMDB) API

## Project Structure

```
src/
├── components/     # Reusable components
├── views/         # Page components
├── store/         # Vuex store
├── router/        # Vue Router configuration
└── assets/        # Static assets
```

## License

MIT 