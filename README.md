**Technology used:**  ![postman](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335363/icons/postman.png) ![nodeJS](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335362/icons/nodejs.png) ![github](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335362/icons/github.png) ![mongoDB](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335362/icons/mongo%20db.png)  ![jwt](https://res.cloudinary.com/djmev9ppr/image/upload/v1705335362/icons/jwt.png)  ![ExpressJS](https://res.cloudinary.com/djmev9ppr/image/upload/v1705333416/icons/Expressjs.png)  ![JavaScript](https://res.cloudinary.com/djmev9ppr/image/upload/v1705071655/icons/js.png) ![Multer]()


---
> *Handling APIs*

** User signup **
- ` HTTP post request` URL: `http://localhost:5000/api/v1/signup`  with json body as:
    ```Json
        {
            "email":"",
            "password":""
        }
    ```

** User login **
- ` HTTP post request` URL: `http://localhost:5000/api/v1/login`  with Json body as:
    ```Json
        {
            "phoneNumber":"",
            "password":""
        }
    ```

** user logout **
- ` HTTP post request` URL: `http://localhost:5000/api/v1/logout`  with empty Request body as:
    


** update user profile **
- ` HTTP post request` URL: `http://localhost:5000/api/v1/profile/update`  with json body as:
    ```Json
        {
            "address":"any",
            "dob":"2024-03-03"
            "profilePhoto": file,
        }
        
    ```



---
> *Runnig this project on local machine*
-   ```Javascript
        npm install 
    ```

-   ```Javascript
        npx tsc -b  [to complie .ts files to .js files] 
    ```

-   ```Javascript
        npm run dev 
    ```