FROM ubuntu:latest AS backend-builder

ADD build/user_database_app /usr/local/bin

FROM ubuntu:latest AS frontend-builder

ADD web-app.tar.gz /tmp
RUN tar -zxf /tmp/web-app.tar.gz
