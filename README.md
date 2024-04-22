# F1 23 Stats Web Application

## Introduction

F1 23 Stats is a web application for Formula 1 enthusiasts to keep track of the latest stats from the current season. This platform provides a user-friendly interface for accessing lap times, driver information, and other race-related data.

## Features

- User Authentication: Secure sign-up and login functionality.
- Lap Times Display: A table of lap times from the 2023 season.
- Stat Recording: Users can add, view, edit, and delete stats for each grand prix.
- Real-time Updates: Lap times and stats are updated in realtime.
- Responsive Design: Compatible with various devices and screen sizes.

## Technologies Used

- React.js
- Node.js
- Express.js
- MongoDB
- Tailwind CSS
- JWT for Authentication

## Setup and Installation

To run the F1 23 Stats app locally, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/alialoraebi/F1_23_App.git
```

2. Install the dependencies for the "backend" and "f1-23-app" directories:
```bash
npm install
```
Inside the backend directory, create a .env file and add your own MongoDB PASSWORD and JWT_SECRET. Make sure the MongoDB connection in server.js is changed to match your MongoDB account.

3. Start the development server for the "backend" and "f1-23-app" directories:
```bash
npm start
```

4. Usage

After logging in, users can view the latest lap times and enter their stats for each grand prix. The data can be modified only by the user who entered it, ensuring personal data management.

5. Open http://localhost:3000 in your browser to view the app.

## Contributing

If you would like to contribute to the development of F1 23 Stats, please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.

3. Make your changes and commit them to your branch.

4. Push your changes to your fork and create a pull request.

## License

F1 23 Stats is not licensed yet

