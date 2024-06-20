## socialnetwork

## description

This is a simple social media website, made by using MERN stack with Next.js and websockets. 

It has following features:-

1) Registration and Login 
2) Creation and Customization of profiles
3) content sharing, liking, and commenting.
4) Private messaging
5) Follow and unfollow users

## Installation Instructions

1) clone the repo and open it in vscode or any other code editor.

2) go to terminal and split it into two.

3) write "cd client" in one terminal window and "cd server" in another terminal window, to change directories to client and server folders respectively in each terminal window.

4) write " npm ci " in each terminal to install all dependencies at same versions as used in this process.

5) To run this project, you will need to create a `.env` file in the server folder with the following environment variables:

```plaintext
database=your_database_link(e.g. mongodb+srv://<username>:<password>@cluster0.xfpbdyq.mongodb.net/<collection_name>?retryWrites=true&w=majority&appName=Cluster0)

JWT_SECRET=create_any_secret(e.g. "my_secret")

cloudinary_name=your_cloudinary_name (from cloudinary website)
cloudinary_key= your_cloudinary_key
cloudinary_secret= your_cloudinary_secret

6) 


