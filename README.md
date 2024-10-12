SoulTap - Social Media Website
SoulTap is a social media platform that allows users to register, post content, like posts, and upload profile pictures. Users can edit and delete their posts, as well as manage their profiles.

Features
User Authentication: Register, login, and logout functionality with JWT for session management.
Post Management: Create, edit, and delete posts with like functionality.
Profile Upload: Users can upload and update profile pictures.
Post Likes: Users can like/unlike posts.
Technologies Used
Backend: Node.js, Express.js
Database: MongoDB (via Mongoose)
Authentication: JWT & bcrypt for password hashing
Templating Engine: EJS
File Uploads: Multer for handling image uploads
Other Libraries: Moment.js for time formatting, Cookie-Parser for cookie management  

Setup Instructions
Clone the repository:
git clone https://github.com/Rohitth10e/SoulTap-socialmedia-website.git

Install dependencies:
npm install

Set up a .env file with your MongoDB connection string and JWT secret.

Run the server:
npm start
Access the application on localhost:3000.


Folder Structure
models/ - Contains Mongoose models for User and Post.
views/ - EJS templates for rendering frontend.
public/ - Static files like CSS, JavaScript, and images.
config/ - Multer configuration for file uploads.
Routes
/ - Home Page
/register - User registration
/login - User login
/profile - User profile page
/upload - Profile picture upload
/post - Create a new post
/like/:id - Like/unlike a post
/edit/:id - Edit a post
/delete/:id - Delete a post
/logout - User logout
License
This project is licensed under the MIT License.
