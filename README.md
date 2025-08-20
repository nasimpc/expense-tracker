# Expense Tracker 
 
## How to use

* step 1: npm install
* step 2: .env file creation (example model):
```sh
PORT='3000'
JWT_SECRET_KEY='secretkey'
SIB_API_KEY ='qwiwegnkasdjvakdglasefdiaskdfasdkasgasdkjdfkjadsfkng'
RAZORPAY_KEY_ID=''
RAZORPAY_KEY_SECRET=''

WEBSITE="http://localhost:3000"

BUCKET_NAME = 'jasdfjasdf'
AWS_ACCESS_KEY_ID='asdfasdfasdf'
AWS_SECRET_ACCESS_KEY='asdfasdfasdf'

DATABASE_NAME='expense-tracker'
DATABASE_USERNAME='root'
DATABASE_PASSWORD='asdfasdfasdf'
DATABASE_DIALECT='mysql'
DATABASE_HOST='localhost'
```
* step 4: npm start
* step 5: url to start the web application eg: http://localhost:3000(port number)/
* Thank you for using Expense-tracker. for any futher enquery and support, email: nasimpcm@gmail.com

  # Api documentation
  
  ## List of available Routes
  
  **Expense route**:
  
  * `POST expense/add-expense`- for adding a new expense
  * `GET expense/get-expenses`- for getting expenses to show in the expense table
  * `DELETE expense/delete-expense/:id`- deleting a particular expense from the expense table
  
  **premium route**:
  
  * `POST premium/leaderboard-data`- for getting top users names sorted by descending order of their expense 
  * `GET premium/download` - downloading the details about the expenses of the user
  
  **purchase route**:
  
  * `POST purchase/premium-membership`- changing from normal user to premium user
  
  **user route**:
  
  * `POST user/add-user`- signup
  * `POST user/login`-login
  * `GET user/get-users`- get details about all other users
  * `GET user/get-user`- to get details of the current user from saved JWT token in local storage

  **password route**:
  
  * `POST password/forget-password`- get change password email
  * `GET password/reset/:id`- get from for changing password
  * `POST password/reset`- change the password
  
  
  
  
  

