# User management back-end

## Setup

Conan Configuration

```sh
conan config set general.revisions_enabled=1
```

*Note*: You will need to clear your conan cache, use `conan remove -f '*'`

## Usage

Package

```sh
conan create . 1.0.0-dev.0+`git rev-parse --short HEAD`
```

Deploy (after packing)

```sh
conan install 1.0.0-dev.0+`git rev-parse --short HEAD`
```
