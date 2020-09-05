FROM ubuntu:latest

ADD build/user_database_app /usr/local/bin
ADD build/web-app.tar.gz /tmp
ADD backend/certs /opt/um/certs

RUN tar -zxf /tmp/web-app.tar.gz -c /opt/um \
 && chmod +x /usr/local/bin/user_database_app

WORKDIR /opt/um

ENTRYPOINT user_database_app dist certs -a "0.0.0.0" -p 8443 -n 4
