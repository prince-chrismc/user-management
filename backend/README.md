# User management back-end

## Setup

### Conan Configuration

> :warning: This come be done before any configuration!

```sh
conan config set general.revisions_enabled=1
```

*Note*: You will need to clear your conan cache, use `conan remove -f '*'`

### Conan Lockfile

To create the top level `conan.lock` run:

```sh
conan lock create --base .
```

To generate a lock file for your system and configuration.

```sh
conan lock create . --lockfile=conan.lock --lockfile-out=build/conan-debug.lock -s build_type=Debug -s compiler.libcxx=libstdc++11 --update
```

*Note*: You will need to change the "build type" to match your intentions

### Install Dependencies

```sh
cd build && conan install .. --lockfile=conan-debug.lock
```

## Usage

### Package

```sh
conan create . 1.0.0-dev.0+`git rev-parse --short HEAD`
```

### Deploy

> :notebook: This step requires the [packing](#package) to be completed first

```sh
conan install 1.0.0-dev.0+`git rev-parse --short HEAD`
```
