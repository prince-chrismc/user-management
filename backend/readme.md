# User Management Back-end

## Setup

In order to get started you will need to satisfy the following requirements:

- C++14 capable build environment
- CMake v3.19 (recommend v3.23 to take advantage of presets when working locally)
- Conan v1.51

### Conan Configuration

> :warning: This **must** be done before any usage!
> It assumes the default configuration is present. This can reset yours with `conan config init --force`.
> Old packages in your local conan cache will become invalid. This can be cleared using `conan remove -f '*'`.

Install the extended settings model, setup the custom remote, and configure the necessary settings:

```sh
conan config install -t dir .conan
```

#### Targeting different `C` library implementations

> :information_source: This is only relevant to Linux with GCC and is primarily for the continuous integration and delivery automation

The Conan default `settings.yml` does not take these into account. You will need to sign into the `user-management` remote that was installed
with the configuration to download any pre-compiled binaries.

The settings model can be extended by configuring your default profile (or build settings)

```sh
conan profile update settings.compiler.musl=1.2 default
# or
conan profile update settings.compiler.glibc=2.32 default
```

For more option see [Profiles](https://docs.conan.io/en/latest/reference/profiles.html) documentation.

## Local Development

### Conan Install

Conan takes the "tool integration" approach that CMake offers and no longer supports being called from CMake.
This means you'll need to call `conan install` before you start working.

```sh
# Prepare Conan
conan lock create conanfile.py --version=0.0.0 -pr:b=default --lockfile=conan.lock --lockfile-out=build/conan.lock
conan install conanfile.py --lockfile=build/conan.lock -if build
```

### Configure CMake

```sh
# Configure CMake
cmake --preset release

# Build
cmake --build build/Release
```

#### Using Ninja

If you would like to improve build times, [Ninja](https://ninja-build.org/manual.html) is a great way to get that with little effort.
Simply use the provided `ninja` profile when preparing Conan.

```sh
conan lock create conanfile.py --version=0.0.0 -pr:h=ninja -pr:b=ninja --lockfile=conan.lock --lockfile-out=build/conan.lock
conan install conanfile.py --lockfile=build/conan.lock -if build
```

### Setting up in Debug

Generate a lockfile with the provided `debug` profile and run the `conan install` command.

```sh
conan lock create conanfile.py --version=0.0.0 -pr:h=debug -pr:b=debug --lockfile=conan.lock --lockfile-out=build/conan.lock
conan install conanfile.py --lockfile=build/conan.lock -if build
```

Select the `debug` preset when configuration CMake

```sh
cmake --preset debug -B build
```

### VS Code and Extensions

The bare minium to work on the user management back-end is

- [C/C++ Extension Pack v1.2.0](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools-extension-pack)

For the CMake extension, make sure you have at least version 1.12.3 or greater installed so it can
take advantage of the features Conan offers. You may need to install the [nightly preview](https://github.com/microsoft/vscode-cmake-tools/pull/2544#issuecomment-1164797621).

- [CMake Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools)

:information_source: It's important to note that the opening VS Code before `conan install` may populate a CMake cache that
does not load the toolchain. If the `Using Conan toolchain` does not appear in the logs, delete your `CMakeCache.txt` and try again.

### Configuration Options

When configuring CMake using `cmake --preset release -B build` you can also add addition flags to enable:

- building tests `-DBUILD_TESTS=ON`
- running linters `-DRUN_TIDY=ON`

### Updating Dependencies

To update the top level `conan.lock` run:

```sh
conan lock create conanfile.py --version=1.0.0-dev.1 --base --update
```

You'll also need to refresh the Conan lockfile and generated information.
Simply re-run the [`conan install`](#conan-install) command.

## Usage

### Lock Dependency Graph

```sh
conan lock create conanfile.py --version 1.0.0-dev.1+`git rev-parse --short HEAD` --lockfile=conan.lock --lockfile-out=build/conan.lock -pr:b=default
```

### Package Back-end

```sh
conan create conanfile.py 1.0.0-dev.1+`git rev-parse --short HEAD`@ --lockfile build/conan.lock
```

### Install Application

> :notebook: This step requires the [packing](#package-back-end) to be completed first

```sh
conan install user-management/1.0.0-dev.1+`git rev-parse --short HEAD`  --lockfile build/conan.lock
```

### Build Docker Image

```sh
docker build . -f Dockerfile -t user-management-backend:1.0.0-dev.1 # Docker does not support SemVer build information
```

## Run Container

```sh
docker run --rm -d -p 8443:8443 -v "$(pwd):/dist" user-management-backend:1.0.0-dev.1
```

> :notebook: By default the back-end image is setup for HTTPS for unsecure transport use the following

```sh
docker run --rm -d -p 8080:8080 -v "$(pwd):/dist" user-management-backend:1.0.0-dev.1 dist -a "0.0.0.0" -p 8080 -n 4
```
