# User Management Front-end

## Setup

Install dependencies

```sh
yarn install
```

## Developement

Run development server

```sh
yarn dev
```

Run tests

```sh
yarn test
```

Run ESlint

```sh
yarn lint
```

### Updating dependencies

A _light_ update within semver range (low risk to break)

```sh
yarn upgrade
```

to manage which version and changes to adopt

```sh
yarn upgrade-interactive
```

#### Webpack Bundle Analyzer

Run in development

```sh
yarn dev:bundleanalyzer
```

Run on the production optimized build

```sh
yarn build:bundleanalyzer
```

### Usage

#### Package Front-end

Create a `dist` directory containing the static files of the user interface.

```sh
yarn build
```

Optionally, when deploying on the cloud you may specify the URL of the back-end

```sh
yarn build --env API_URL=https://ec2-18-222-250-141.us-east-2.compute.amazonaws.com
```

Depending on your needs, you might want to do more optimization to the production build.

#### NPM distribution package (unsupported)

Can be simply created via

```sh
yarn pack
```

#### Build Docker Image

```sh
docker build . -f Dockerfile -t user-managment-frontend:1.0.0-dev.1 # Docker does not support SemVer build information
```

As an alternative, the previsous two teps (package and build image), can be execture with the multistage builder

```sh
docker build . -f Dockerfile.multistage \
--build-arg api_url=https://ec2-18-222-250-141.us-east-2.compute.amazonaws.com \
-t user-managment-frontend:1.0.0-dev.1 
```

### Run Containers

```sh
docker run --rm -d -p 80:80 user-managment-frontend:1.0.0-dev.1
```
