# User Management Back-end

## Setup

### Conan Configuration

> :warning: This **must** be done before any usage!
> It assumes the default configutation is present. This can reset yours with `conan config init --force`.
> Old packages in your local conan cache will become invalid. This can be cleared using `conan remove -f '*'`.

Install the extended settings model, setup the custom remote, and configure the necessary settings:

```sh
conan config install -t dir backend/.conan
```

#### Targeting different `C` library implementations

The Conan default `settings.yml` does not take these into account. You will need to sign into the `user-management` remote that was installed
with the configuration to download the pre-compiled binaries.

The settings model can be extended by configuring your default profile (or build settings)

```sh
conan profile update settings.compiler.musl=1.2 default
# or
conan profile update settings.compiler.glibc=2.32 default
```

For more option see [Profiles](https://docs.conan.io/en/latest/reference/profiles.html) documentation.

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

### Configuration Options

Enable building tests

```sh
cmake .. -DBUILD_TESTS=ON
```

Enable running linters

```sh
cmake .. -DRUN_TIDY=ON
```

### Updating Dependencies

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

### Lock Dependency Graph

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
