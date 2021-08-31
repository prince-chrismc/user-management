# User Management Back-end

## Setup

### Conan Configuration

> :warning: This **must** be done before any usage!
If that is not possible, you will need to clear your conan cache. This can be done using `conan remove -f '*'`

Enable recipe revisions

```sh
conan config set general.revisions_enabled=1
```

#### Targeting different `C` library implementations

The Conan default `settings.yml` does not take these into account. The settings model can be extended by doing the following:

1. install an extended settings model

```sh
conan config install .conan/settings.yml
```

2. configure your profile (or build settings)

```sh
conan profile update settings.compiler.musl=1.2 default
# or
conan profile update settings.compiler.glibc=2.32 default
```

## Development

Generate build files via CMake

```sh
mkdir build
cmake ..
```

Build the project

```sh
cmake --build . # from the build folder
```

Enable building tests

```sh
cmake .. -DBUILD_TESTS=ON
```

Enable building tests

```sh
cmake .. -DRUN_TIDY=ON
```

### Updating dependencies

To update the top level `conan.lock` run:

```sh
conan lock create conanfile.py --version=1.0.0-dev.1 --base --update
```

```sh
conan lock create conanfile.py --version=1.0.0-dev.1 -s build_type=Debug --lockfile=conan.lock --lockfile-out=build/conan.lock -u
conan install conanfile.py --lockfile=build/conan.lock -if build
```

*Note*: You will need to change the "build type" to match your intentions

## Usage

### Lock Dependency graph

```sh
conan lock create conanfile.py --version 1.0.0-dev.1+`git rev-parse --short HEAD` --lockfile=conan.lock --lockfile-out=locks/conan.lock
```

### Package Back-end

```sh
conan create conanfile.py 1.0.0-dev.1+`git rev-parse --short HEAD`@ --lockfile locks/conan.lock
```

### Install Application

> :notebook: This step requires the [packing](#package) to be completed first

```sh
conan install user-managment/1.0.0-dev.1+`git rev-parse --short HEAD`  --lockfile locks/conan.lock
```

### Build Docker Image

```sh
docker build . -f Dockerfile -t user-managment-backend:1.0.0-dev.1 # Docker does not support SemVer build information
```

## Run Container

```sh
docker run --rm -d -p 8443:8443 -v "$(pwd):/dist" user-managment-backend:1.0.0-dev.1
```

> :notebook: By default the back-end image is setup for HTTPS for unsecure transport use the following

```sh
docker run --rm -d -p 8080:8080 -v "$(pwd):/dist" user-managment-backend:1.0.0-dev.1 dist -a "0.0.0.0" -p 8080 -n 4
```
