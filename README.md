# Hospital Navigation UI

## Installation

### Prerequisites
-  Node.js v20.0.0 or later


### Installation
Run the following commands to install the project dependencies:
```
npm install
```

## Usage

### Development Mode
- Create a `.env.development.local` file in the root directory of the project and add the following environment variables:
```
VITE_BACKEND_WS_URI=ws://localhost:8000/ws
```

- Run the following command to start the server in development mode:
```
npm run dev
```

- Open the following URL in your browser:
```
http://localhost:5173/
```


### Production Mode
- Create an empty `.env.production.local` file in the root directory of the project.
- Run the following command to build the project:
```
npm run build
```
NOTE: The build artifacts is served by FastApi server in the `chat_interface` directory. Make sure both `chat-react` and `chat_interface` are in the same parent directory.

- Run the `chat_interface` server to see the changes
