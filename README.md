# User management project
Full user management CRUD done on **NestJs**

# Technology used
- NodeJs v14.16.0
- NestJs 7.5.6
- MariaDb 10.5 or Postgresql 13.2

# Installation
- **Clone the repository**
~~~~
git clone https://github.com/renatops1991/nestjs-crud.git
~~~~

- **After downloading the repository, enter the project folder and install the dependencies via npm**
~~~~
npm install
~~~~

- **After installing the dependencies, run the docker-compose lower command to run the project**
~~~~
docker-compose up -d
~~~~

# API Doc
**Routes**
- Authentication
    - Create user to authentication: ` POST: /auth/signup ` <br>
    **body:**
      ~~~
      {
          "name": "Full Name",
          "email": "exemple@exemple.com",
          "password" : "password",
          "passwordConfirmation": "password"
      }
      ~~~
      
    - Generator API token: `POST: /auth/signin ` <br>
        **body**: 
       ~~~
      {
          "email": "exemple@exemple.com",
          "password" : "password",
      }
      ~~~
      
    - Returns authenticated user: ` GET: /auth/me `
    
# Authenticated endpoints
The lower endpoints need authentication accuracy to be able to function correctly

**User Routes:**
- Return all users by parameters: ` GET /users?status=1&page=1&limit=10 `
- Return user by ID: ` GET /users/{:id} `
- Create Admin user: ` POST /users `
- Create user: ` POST /users/createUser `
- Update user by ID: ` PUT /users/{:id} `
- Delete user by ID: ` DELETE /users/{:id} `
