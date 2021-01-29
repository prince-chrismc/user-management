# User management back-end

## Setup

### Conan Configuration

> :warning: This come be done before any configuration!

```sh
conan config set general.revisions_enabled=1
```

*Note*: You will need to clear your conan cache, use `conan remove -f '*'`

<!--> TODO: Add instructions for installing musl libc settings <-->

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

## Development

### Update Conan Lockfile

```sh
conan lock create conanfile.py --version=1.0.0-dev.0 --base --update
```

```sh
cd build && conan install .. -s build_type=Debug --lockfile=../conan.lock
```

## Usage

### Package Back-end

```sh
conan create . 1.0.0-dev.0+`git rev-parse --short HEAD`@
```

### Install Application

> :notebook: This step requires the [packing](#package) to be completed first

```sh
conan install user-managment/1.0.0-dev.0+`git rev-parse --short HEAD`
```

### Build Docker Image

```sh
docker build . -f Dockerfile -t user-managment-backend:1.0.0-dev.0 # Docker does not support SemVer build information
```

## Run Container

```sh
docker run --rm -d -p 8443:8443 -v "$(pwd):/dist" user-managment-backend:1.0.0-dev.0
```

> :notebook: By default the back-end image is setup for HTTPS for unsecure transport use the following

```sh
docker run --rm -d -p 8080:8080 -v "$(pwd):/dist" user-managment-backend:1.0.0-dev.0 dist -a "0.0.0.0" -p 8080 -n 4
```
