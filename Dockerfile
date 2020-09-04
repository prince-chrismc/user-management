FROM ubuntu:latest

ADD build/user_database_app /usr/local/bin
ADD web-app.tar.gz /tmp
ADD backend/certs /opt/um/certs

RUN tar -zxf /tmp/web-app.tar.gz

ENTRYPOINT user_database_app . /opt/um/certs -a "0.0.0.0" -p 8443 -n 4
