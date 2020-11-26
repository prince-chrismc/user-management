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
conan lock create --base conanfile.py --update
```

To generate a lock file for your system and configuration.

```sh
conan lock create conanfile.py --lockfile=conan.lock --lockfile-out=build/conan.lock -s build_type=Debug -s compiler.libcxx=libstdc++11
```

*Note*: You will need to change the "build type" to match your intentions

### Install Dependencies

```sh
cd build && conan install .. --lockfile=conan.lock
```

## Usage

### Package

```sh
conan create . 1.0.0-dev.0+`git rev-parse --short HEAD`@
```

### Deploy

> :notebook: This step requires the [packing](#package) to be completed first

```sh
conan install user-managment/1.0.0-dev.0+`git rev-parse --short HEAD`
```

## Development

```sh
conan lock create conanfile.py --version=1.0.0-dev.0 --base --update
```

```sh
conan install .. -s build_type=Debug --lockfile=../conan.lock
```
