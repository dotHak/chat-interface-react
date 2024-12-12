# Hospital Navigation UI Documentation

## Overview

The **Hospital Navigation UI** is a user-friendly web interface designed to facilitate hospital navigation, service inquiries, and appointment booking. Built using **ReactJS** and **Vite**, it delivers a responsive and efficient frontend experience. The deployment is managed through **AWS CloudFront**, ensuring fast, secure, and scalable delivery of the application.

---

## Features

- Interactive and intuitive user interface for hospital services.
- Seamless integration with the backend via WebSockets and REST APIs.
- Optimized for performance using Vite.
- Built-in support for local and production environments.
- Scalable and secure deployment via AWS CloudFront with SST.

---

## Installation

### Prerequisites

Ensure the following tools are installed on your machine:

1. **Node.js**: v20.0.0 or later ([Download Node.js](https://nodejs.org/))  
2. **npm**: Latest version ([Learn about npm](https://docs.npmjs.com/))

---

### Installation Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo-url.git
    cd your-repo-name
    ```

2. Install project dependencies:
    ```bash
    npm install
    ```

---

## Usage

### Development Mode

1. Create a `.env.development.local` file in the root directory and define the following environment variables:
    ```env
    VITE_BACKEND_WS_URI=ws://localhost:8000/ws
    VITE_BACKEND_URL=http://localhost:8000
    ```

2. Start the development server:
    ```bash
    npm run dev
    ```

3. Access the UI in your browser:
    ```
    http://localhost:5173/
    ```

---

### Production Mode

1. Create a `.env.production.local` file in the root directory. This can be empty or include production-specific environment variables.
2. Build the project:
    ```bash
    npm run build
    ```
3. Preview the production build locally:
    ```bash
    npm run preview
    ```
4. Access the project in your browser using the preview URL.

---

## Deployment

### Deployment to AWS with CloudFront

The **Hospital Navigation UI** is deployed using **AWS CloudFront**, managed via **SST (Serverless Stack Toolkit)**. AWS CloudFront is a global Content Delivery Network (CDN) that ensures fast and secure delivery of web applications.

---

### Prerequisites

1. **AWS Account** ([Sign up](https://aws.amazon.com/))  
2. **AWS CLI** ([Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html))  
3. **SST CLI** ([Learn more about SST](https://sst.dev/docs))  

---

### Deployment Steps

1. **Prepare the Environment**:
    - Create a `.env.production.local` file in the root directory and define the production variables:
      ```env
      VITE_BACKEND_WS_URI=wss://your-backend-url/ws
      VITE_BACKEND_URL=https://your-backend-url
      ```

2. **Build the Project**:
    - Build the production-ready UI:
      ```bash
      npm run build
      ```

3. **Update SST Configuration**:
    - Open the `sst.config.ts` file and configure the stack to align with your AWS account and CloudFront distribution settings.

4. **Deploy Using SST**:
    - Deploy the UI to AWS CloudFront:
      ```bash
      npx sst deploy --stage production
      ```

5. **Access the Deployed Application**:
    - Retrieve the CloudFront distribution URL from the SST deployment logs or the AWS Console.
    - Open the URL in your browser to access the deployed UI.

---

### Benefits of AWS CloudFront

1. **Global Delivery**: Fast content delivery using AWS's global CDN infrastructure.
2. **Scalability**: Automatically handles increased traffic without impacting performance.
3. **Security**: Built-in DDoS protection and HTTPS support ensure secure access.
4. **Cost-Efficiency**: Pay-as-you-go model minimizes costs for development and production.

---

## Best Practices

1. **Environment Management**: Use separate `.env` files for development and production to avoid misconfigurations.
2. **Performance Optimization**: Regularly monitor CloudFront analytics for performance insights.
3. **Security**: Use HTTPS for all backend connections and secure environment variables in production.

---

## Additional References

- **ReactJS Documentation**: [React Docs](https://reactjs.org/)  
- **Vite Documentation**: [Vite Docs](https://vitejs.dev/)  
- **AWS CloudFront Documentation**: [CloudFront Docs](https://aws.amazon.com/cloudfront/)  
- **SST Documentation**: [SST Docs](https://sst.dev/)  
