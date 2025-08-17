# Real-Time-Collaboration-Tool

*COMPANY*: CODTECH IT SOLUTIONS

*NAME*: SANIA RAVINDRA GADE

*INTERN ID*: CT08DH308

*DOMAIN*: SOFTWARE DEVELOPMENT

*DURATION*: 8 WEEKS

*MENTOR*: NEELA SANTOSH

## 📌 Introduction
In this project, we are developing a **real-time collaborative code editor** where multiple users can edit code simultaneously and see updates instantly.  
The application is built using **Node.js, Express, Socket.IO, and CodeMirror**.  

The goal is to provide a **modern, responsive, browser-accessible platform** where users can write, edit, and view code in real-time without refreshing the page.  
This project replicates some features of advanced tools like **Google Docs** or online IDEs such as **CodeSandbox** and **Repl.it**, but in a simplified form.

---

## 🎯 Objective
The main objective is to allow multiple users to connect to a **shared code editor** and collaborate efficiently.  
Any changes made by one user should instantly reflect in other users’ browsers.  

This eliminates the need for repeatedly sending updated files manually and fosters **seamless teamwork**.

---

## 🛠️ Technologies Used
- **Node.js** → Backend runtime environment  
- **Express.js** → Lightweight web framework for routes & serving files  
- **Socket.IO** → Real-time, bi-directional communication between client & server  
- **CodeMirror** → Browser-based code editor with syntax highlighting & formatting  
- **HTML, CSS, JavaScript** → Frontend structure, styling & scripting  

---

## 🚀 Features
- **Real-time Code Updates** → Any changes made by one user are broadcast instantly to all connected clients using Socket.IO.  
- **Syntax Highlighting** → Powered by CodeMirror for multiple programming languages.  
- **Multiple User Support** → All connected users can type simultaneously and see updates in real-time.  
- **Cross-Browser Compatibility** → Works on Chrome, Firefox, Edge, and modern browsers.  
- **No “Go Live” Required** → Runs directly with `npm start`.  
- **Scalable Architecture** → Can be deployed on **Heroku, Render, or Vercel**.  

---

## ⚙️ Working Principle
1. **Client Connection** → User connects to server via Socket.IO.  
2. **Editor Initialization** → CodeMirror loads with predefined settings.  
3. **Change Detection** → Typing triggers change events sent to server.  
4. **Broadcasting Changes** → Server broadcasts updates to all clients (except sender).  
5. **Real-time Updates** → All connected clients see changes instantly.  

---

## 🖥️ Steps to Run the Project Locally
1. Install [Node.js](https://nodejs.org) (if not already installed).  
2. Create a project folder and navigate into it.  
3. Initialize project & install dependencies:
   ```bash
   npm init -y
   npm install express socket.io
4.Download CodeMirror or use a CDN in your HTML file.
5.Create server.js for backend code and public/index.html for frontend.

6.Start the server:
node server.js

7.Open the browser at:
http://localhost:3000

8.Open multiple tabs or devices to test real-time collaboration.

## ScreenShort

<img width="1923" height="1083" alt="image" src="https://github.com/user-attachments/assets/b54e9909-e80c-4e43-ae2b-200597c51a79" />

<img width="1919" height="958" alt="image" src="https://github.com/user-attachments/assets/e8973cab-640a-4e39-9918-f1b3bb83a2c0" />

## Conclusion
The Real-Time Collaborative Code Editor successfully demonstrates how multiple users can work together on the same code in real-time. By leveraging Node.js, Express, Socket.IO, and CodeMirror, the system provides instant synchronization, syntax highlighting, and a smooth collaborative experience directly in the browser.

This project highlights the power of WebSockets for real-time communication and showcases how collaborative platforms like online IDEs and document editors can be built from scratch.

It can be further enhanced by adding features such as:

User authentication and role management

Support for multiple programming languages

File storage and version control

Integrated chat for communication

Overall, the project serves as a solid foundation for building advanced collaborative coding environments that encourage teamwork, improve productivity, and reduce the friction of manual code sharing.



