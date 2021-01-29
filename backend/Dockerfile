FROM alpine:3.12

RUN apk update && apk add --no-cache libstdc++

ADD bin/user_database_app /usr/local/bin
ADD certs /opt/um/certs

WORKDIR /opt/um

ENTRYPOINT ["user_database_app"]
CMD ["dist", "certs", "-a", "0.0.0.0", "-p", "8443", "-n", "4"]
