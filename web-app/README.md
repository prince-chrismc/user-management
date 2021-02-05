# react-starter-boilerplate-hmr

Originally created by: [@esausilva](https://github.com/esausilva)

## Usage

Install dependencies

```sh
yarn install
```

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

### Building

```sh
yarn build
```

Will create a `dist` directory containing your compiled code.

Depending on your needs, you might want to do more optimization to the production build.

### NPM package

Can be simply created via

```sh
npm pack
```

### Updating dependencies

A _light_ update within semver range (low risk to break)

```sh
yarn upgrade
```

or more agressively to change `package.json`

```sh
yarn upgrade --latest
```

## Webpack Bundle Analyzer

Run in development

```sh
yarn dev:bundleanalyzer
```

Run on the production optimized build

```sh
yarn build:bundleanalyzer
```
