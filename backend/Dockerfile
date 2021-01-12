FROM alpine:3.12 as downloader

ARG VERSION=latest
ARG CONAN_REMOTE
ARG USER

RUN apk update && apk add --no-cache py-pip g++ && pip install conan
RUN --mount=type=secret,id=password conan remote add remote $CONAN_REMOTE && \
        conan user -p $(cat /run/secrets/password) -r remote $USER
RUN conan install user-management/$VERSION@ # profile

FROM alpine:3.12

RUN apk update && apk add --no-cache libstdc++
COPY --from=downloader bin/user_management_app /usr/bin
