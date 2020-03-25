# Authentication Microservice

## Features

* User SingUp
* User SigIn returning JWT
* User check authentication with JWT
* User authenticated can update your data
* User authenticated can delete your account
* Search user by Id

### Checks

[ ] make sure that .env file is created
[ ] make sure if you will use docker

### Using docker

1. To test:

``` docker-compose -p tests run -p 3000 auth-microservice yarn test ```

2. To build:

``` docker-compose up --build -d ```

*With docker you not need use npm or yarn install*

### Using your local machine

1. download npm or yarn
2. npm or yarn install
3. npm or yarn dev

To build to production
``` yarn run build ```

and deploy dist file
