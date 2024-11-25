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
- Run the following command to start the server in production mode:
```
npm run preview
```
- Open the url in your browser to view the project.


## Deployment
### Prerequisites
- SST (Serverless Stack Toolkit) CLI. You can read more [here](https://sst.dev/docs)
- AWS Account
- AWS CLI

### Deployment Steps
- Create a `.env.production.local` file in the root directory of the project and add the environment variables mentioned above.
- Build the project like mentioned above.
- Update the configuration in `sst.config.ts` to match your AWS account or resources.
- Run the following command to deploy the project:
```
npx sst deploy --stage production
```
