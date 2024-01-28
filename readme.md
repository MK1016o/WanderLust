# Wanderlust - Airbnb Clone

Wanderlust is a web application inspired by Airbnb, allowing users to explore accommodations and hosts to list their properties for rental.

## Features

- **User Authentication:** Passport.js is used for secure user authentication with a local strategy.

- **Accommodation Listings:** Hosts can create, edit, and delete accommodation listings with details such as title, description, price, and images.

- **Image Upload:** Cloudinary integration allows hosts to upload and manage images for their accommodation listings.

- **Map Integration:** Mapbox SDK displays the location of accommodations on a map.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/wanderlust.git

2. **Navigate to the project directory:**

    ```bash
    cd wanderlust

3. **Install Dependencies**

    ```bash
    npm install

4. **Create a .env file with the following variables:**

    ```env
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_KEY=your_cloudinary_api_key
    CLOUDINARY_SECRET=your_cloudinary_api_secret
    MAPBOX_TOKEN=your_mapbox_access_token
    SESSION_SECRET=your_session_secret
    MONGODB_URI=your_mongodb_connection_string

5. **Run the application:**

    ```bash
    node app.js

6. **Open your web browser and visit http://localhost:8080/listings to view the app.**

## Contributing

Contributions are welcome! Follow these guidelines to contribute:

1. **Fork the project on GitHub.**
2. **Create a new branch for your feature or bug fix.**
3. **Make your changes and test thoroughly.**
4. **Submit a pull request, explaining the changes you've made and why they are necessary.**
