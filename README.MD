# Boilercreate 🚀

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![npm version](https://badge.fury.io/js/boilercreate.svg)](https://badge.fury.io/js/boilercreate)

Boilercreate is a cutting-edge backend project generator for Node.js, designed to supercharge your development workflow. It allows you to create robust, scalable, and secure backend servers with just a few commands.

## 🎯 Purpose

Boilercreate aims to simplify the process of setting up a production-ready backend server. It provides a solid foundation with best practices, security measures, and modern tools, allowing developers to focus on building their core application logic rather than spending time on boilerplate setup.

## 🌟 Features

- ⚡️ Express.js with ESM support
- 🔒 Built-in security with helmet, cors, and rate limiting
- 🗃️ MongoDB integration with Mongoose
- 🔑 JWT authentication
- 📊 Swagger API documentation
- 🧪 Testing setup with Jest and Supertest
- 🐳 Docker and Docker Compose ready
- 🔧 ESLint and Prettier for code quality
- 🚀 GitHub Actions CI/CD
- 📚 Modular architecture for scalability

## 🚀 Quick Start

1. Install Boilercreate globally:

   ```bash
   npm install -g boilercreate
   ```

2. Create a new project:

   ```bash
   boilercreate my-awesome-api
   ```

3. Navigate to your project and start developing:
   ```bash
   cd my-awesome-api
   npm run dev
   ```

## 🛠️ Tech Stack

- **Framework**: Express.js
- **Language**: JavaScript (ESM)
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Documentation**: Swagger UI Express
- **Security**: Helmet, CORS, Express Rate Limit

## 📁 Project Structure

```
my-awesome-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services
```

## 🔧 Available Scripts

- `npm run dev`: Start the development server
- `npm run start`: Start the production server
- `npm run test`: Run tests
- `npm run lint`: Lint the code
- `npm run format`: Format the code

## 🚀 Deployment

Boilercreate comes with Docker support out of the box, making deployment a breeze. You can easily deploy your application to any cloud provider that supports Docker containers.

## 📚 Documentation

The generated project includes Swagger UI for API documentation. Access it by navigating to `/api-docs` when your server is running.

## 🔒 Security

Security is a top priority in Boilercreate. The generated project includes:

- Helmet for setting various HTTP headers
- CORS configuration
- Rate limiting to prevent abuse
- JWT for secure authentication

Always review and adjust security settings based on your specific requirements.

## 🎛️ Customization

While Boilercreate provides a solid starting point, you can easily customize and extend the generated project to fit your specific needs. The modular architecture makes it easy to add or remove features.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 💖 Support

If you find Boilercreate helpful, please consider:

- ⭐️ Starring the GitHub repo
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔀 Submitting pull requests

## 📄 License

Boilercreate is open-source software licensed under the [Apache License 2.0](LICENSE).

## 🙏 Acknowledgements

Special thanks to all the amazing open-source projects that make Boilercreate possible!
