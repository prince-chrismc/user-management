FROM user-management-frontend:latest as fe

FROM user-management-backend:latest

COPY --from=fe /usr/share/nginx/html /opt/um/dist/
