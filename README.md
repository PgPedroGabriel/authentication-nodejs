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

*With docker you not need use npm or yarn install beacause of sharing volumes*

### Using your local machine

1. download yarn
2. yarn install
3. yarn dev

To build to production
``` yarn run build ```

and deploy dist file


To test
``` yarn test ```


### Deploy using a docker image

Build your own docker image, remember to change .env vars

``` docker build -f .\Dockerfile.prod -t auth-microservice-prod . ```
