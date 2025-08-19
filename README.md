# ClearSignalProject Backend

This is the backend service for the ClearSignalProject website. It provides authentication, profile management, email notifications, and media upload functionalities using Node.js and Express.

## Features

- User authentication (including Google login)
- Role-based access control
- Profile management
- Email notifications for user actions
- Cloudinary integration for media uploads
- Modular service and controller structure

## Project Structure

```
Backend/
├── server.js
├── package.json
├── authService/
├── cloudinaryService/
├── config/
├── controller/
├── emailService/
├── middleware/
├── model/
├── routes/
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm
- MongoDB (local or cloud instance)
- Cloudinary account (for media uploads)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Clear-Signal/Backend.git
   cd Backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables: - Create a `.env` file in the root directory. - Add the following variables:

   ```env
   PORT = your port
   JWT_SECRET = your jwt secret
   MONGO_URI = your_mongodb_connection_string
   Frontend_URL = your_frontend_url
   CLOUDINARY_CLOUD_NAME =your_cloudinary_cloud_name
   CLOUDINARY_API_KEY = your_cloudinary_api_key
   CLOUDINARY_API_SECRET =your_cloudinary_api_secret
   ADMIN_EMAIL = your_email_address
   ADMIN_PASSWORD = your_email_password
   GOOGLE_CLIENT_ID = your_google_client_id
   GOOGLE_CLIENT_SECRET = your_google_client_secret
   GOOGLE_REDIRECT_URI = http://localhost:8181/api/auth/google/callback

````

### Running the Server
```sh
npm start
````

The server will start on the port specified in your environment variables or default to 8181.

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` → Register a new user
- `POST /login` → User login
- `POST /logout` → User logout
- `POST /forgot-password` → Send password reset email
- `POST /reset-password/:resetToken` → Reset password with token

### Google Authentication (`/api/auth/google`)

- `GET /google` → Redirect to Google login
- `GET /google/callback` → Google login callback

### User Profile (`/api/user`)

- `GET /profile` → Get user profile (protected)
- `PATCH /profile` → Update user profile (protected, with profile picture upload)

Refer to the `routes/` folder for detailed route definitions.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, contact the ClearSignalProject team at [i.sksingh113@gmail.com].
