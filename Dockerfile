FROM ubuntu:latest AS backend-builder

ADD backend
RUN mkdir build \
&& cd build

FROM ubuntu:latest AS frontend-builder

ADD web-app
RUN echo "yarn"
