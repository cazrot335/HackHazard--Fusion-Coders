# HackHazard--Fusion-Coders

---

## **Overview**
HackHazard--Fusion-Coders is a web-based IDE that integrates advanced features like **code execution**, **syntax validation**, **real-time code completion**, **voice-to-code**, and **image-to-text processing**. It is designed to provide a seamless coding experience with AI-powered assistance.

---

## **Features**

### **1. File Management**
- **Create, Rename, Delete, and Fetch Files**:
  - Users can create new files, rename existing ones, delete files, and fetch file content.
  - File operations are handled via RESTful API endpoints.

### **2. Code Execution**
- Supports execution of code written in:
  - **Python**
  - **JavaScript**
  - **C++**
- Displays output in a terminal-like interface.
- Handles user input during execution (e.g., prompts for input).

### **3. Syntax Validation**
- Validates code syntax for supported languages:
  - **Python**: Uses `py_compile`.
  - **JavaScript**: Uses `node --check`.
  - **C++**: Uses `g++ -fsyntax-only`.
- Highlights syntax errors in the editor.

### **4. Real-Time Code Completion**
- Provides intelligent code suggestions using a Python-based model (e.g., GPT-2).
- Integrated with **Monaco Editor** for a seamless experience.

### **5. Chatbot Assistant**
- AI-powered chatbot for:
  - Explaining code files.
  - Listing project files.
  - Answering user queries.

### **6. Voice-to-Code**
- Converts voice input into code using:
  - **Speech-to-Text (STT)** via the Web Speech API.
  - **Groq API** for generating code from transcribed text.

### **7. Image-to-Text**
- Extracts text from uploaded images using **Tesseract.js**.
- Processes the extracted text with the **Groq API** to generate meaningful responses.

### **8. Terminal Integration**
- Fully functional terminal for displaying output and handling user input during code execution.

---

## **Workflow**

### **Frontend Workflow**
1. **File Management**:
   - Users interact with the file explorer to create, rename, delete, or open files.
   - File operations are sent to the backend via RESTful API calls.

2. **Code Editing**:
   - Users write code in the **Monaco Editor**.
   - Real-time syntax validation and code completion are provided.

3. **Code Execution**:
   - Users run code by clicking the "Run Code" button.
   - Output is displayed in the terminal, and user input is handled dynamically.

4. **Chatbot Interaction**:
   - Users interact with the chatbot to ask questions, explain code, or list files.
   - Voice and image inputs are also supported.

5. **Voice-to-Code**:
   - Users click the microphone icon to speak a prompt.
   - The transcribed text is sent to the backend to generate code.

6. **Image-to-Text**:
   - Users upload an image containing text.
   - The extracted text is processed to generate a response.

---

### **Backend Workflow**
1. **File Operations**:
   - Handles file creation, renaming, deletion, and fetching content.
   - Stores files in the `files` directory.

2. **Code Execution**:
   - Writes the code to a file and executes it based on the language.
   - Supports Python, JavaScript, and C++.

3. **Syntax Validation**:
   - Validates code syntax using language-specific tools.
   - Returns errors with line and column numbers.

4. **Code Completion**:
   - Forwards code completion requests to the Python server running a pre-trained model (e.g., GPT-2).

5. **Chatbot**:
   - Processes user queries using the **Groq API**.
   - Explains code files or lists project files.

6. **Voice-to-Code**:
   - Processes transcribed voice input using the **Groq API** to generate code.

7. **Image-to-Text**:
   - Processes extracted text from images using the **Groq API** to generate responses.

---

## **File Structure**

```
HackHazard--Fusion-Coders/
├── client/                     # Frontend code
│   ├── public/                 # Static assets
│   ├── src/                    # React components and logic
│   │   ├── App.jsx             # Main React component
│   │   ├── App.css             # Styling for the app
│   │   └── index.js            # Entry point for the React app
│   └── package.json            # Frontend dependencies
├── server/                     # Backend code
│   ├── server.js               # Main Node.js server
│   ├── server.py               # Python server for code completion
│   └── files/                  # Directory for storing user files
├── .env                        # Environment variables
├── README.md                   # Project documentation
└── package.json                # Backend dependencies
```
## **Environment Variables**

### **Setting Up the `.env` File**
1. Create a `.env` file in the root directory of the project.
2. Add the following environment variable:
    ```
    GROQ_API_KEY=your_groq_api_key_here
    ```
3. Replace `your_groq_api_key_here` with your actual Groq API key.

> **Note**: Ensure that the `.env` file is included in `.gitignore` to prevent exposing sensitive information.


## **API Endpoints**

### **File Management**
- **GET `/files`**: Fetch all files.
- **GET `/file/:filename`**: Fetch file content.
- **POST `/create-file`**: Create a new file.
- **DELETE `/delete-file/:filename`**: Delete a file.
- **PUT `/rename-file`**: Rename a file.

### **Code Execution**
- **POST `/execute`**: Execute code and return output.

### **Syntax Validation**
- **POST `/validate`**: Validate code syntax.

### **Code Completion**
- **POST `/code-completion`**: Provide real-time code suggestions.

### **Chatbot**
- **POST `/chat`**: Process user queries.

### **Voice-to-Code**
- **POST `/voice-to-code`**: Generate code from voice input.

### **Image-to-Text**
- **POST `/image-to-text`**: Process text extracted from images.

---

## **Technologies Used**

### **Frontend**
- **React**: For building the user interface.
- **Monaco Editor**: For code editing.
- **Tesseract.js**: For OCR (image-to-text).
- **Web Speech API**: For speech-to-text.

### **Backend**
- **Node.js**: For handling API requests.
- **Python**: For running the code completion model.
- **Groq API**: For AI-powered code generation and chatbot responses.

### **Other Tools**
- **Xterm.js**: For terminal emulation.
- **Axios**: For making HTTP requests.

---

## **How to Run the Project**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-repo/HackHazard--Fusion-Coders.git
cd HackHazard--Fusion-Coders
```

### **2. Set Up the Backend**
1. Navigate to the `server` directory:
    ```bash
    cd server
    ```
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Set up the Python environment for the code completion server:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```
4. Start the Node.js server:
    ```bash
    node server.js
    ```
5. Start the Python server for code completion:
    ```bash
    python server.py
    ```

### **3. Set Up the Frontend**
1. Navigate to the `client` directory:
    ```bash
    cd ../client
    ```
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Start the React development server:
    ```bash
    npm start
    ```

### **4. Access the Application**
- Open your browser and navigate to `http://localhost:3000` to access the frontend.
- The backend will be running on `http://localhost:5000` (Node.js) and `http://localhost:8000` (Python).
