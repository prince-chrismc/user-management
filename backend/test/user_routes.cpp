// MIT License

#include "handlers/user_routes.hpp"

#include <catch2/catch.hpp>
#include <restinio/all.hpp>

#include "unit_test/helpers.hpp"

using router_t = handler::router;
using traits_t = restinio::traits_t<restinio::asio_timer_manager_t, restinio::null_logger_t, router_t>;
using server_settings_t = restinio::server_settings_t<traits_t>;
using http_server_t = restinio::http_server_t<traits_t>;

class http_server {
  http_server_t server;
  other_work_thread_for_server_t<http_server_t> other_thread{server};

 public:
  explicit http_server(std::unique_ptr<router_t> router)
      : server(restinio::own_io_context(),
               server_settings_t{}.address("127.0.0.1").port(utest_default_port()).request_handler(std::move(router))) {
    other_thread.run();
  }
};

TEST_CASE("List Endpoints") {
  database::user list;
  list.add(R"##({"name": "John Doe", "email": "john@example.com"})##"_json);

  auto router = std::make_unique<router_t>();
  handler::user::fill::list(*router, list);
  http_server http_server(std::move(router));

  SECTION("GET") {
    const std::string get_list{
        "GET /um/v1/users HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(get_list));
    CHECK_THAT(response, Catch::Contains("200") && Catch::Contains("OK") &&
                             Catch::Contains(fmt::format("ETag: {}\r\n", list.etag())) &&
                             Catch::Contains(nlohmann::json(list).dump()));
  }

  SECTION("GET 304") {
    const std::string get_list{
        "GET /um/v1/users HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "If-None-Match: " +
        list.etag() +
        "\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(get_list));
    CHECK_THAT(response, Catch::Contains("304") && Catch::Contains("Not Modified") && Catch::EndsWith("\r\n\r\n"));
  }

  SECTION("PUT 415") {
    const std::string put_list{
        "PUT /um/v1/users HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Content-Type: text/plain\r\n"
        "Content-Length: 49\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "Jane Doe", "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(put_list));
    CHECK_THAT(response, Catch::Contains("415") && Catch::Contains("Unsupported Media Type") &&
                             Catch::Contains("error") && Catch::Contains("Content-Type") &&
                             Catch::Contains("application/json"));
  }

  SECTION("PUT 415 Bad HTTP header") {
    const std::string put_list{
        "PUT /um/v1/users HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Content-Type: ; not a content\r\n"
        "Content-Length: 49\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "Jane Doe", "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(put_list));
    CHECK_THAT(response, Catch::Contains("415") && Catch::Contains("Unsupported Media Type") &&
                             Catch::Contains("error") && Catch::Contains("Content-Type") &&
                             Catch::Contains("application/json"));
  }

  SECTION("PUT 400") {
    const std::string put_list{
        "PUT /um/v1/users HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: 54\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "malformed JSON" "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(put_list));
    CHECK_THAT(response, Catch::Contains("400") && Catch::Contains("Bad Request") && Catch::Contains("\"error\"") &&
                             Catch::Contains("syntax error"));
  }

  SECTION("PUT 400 Bad Schemas") {
    const std::string put_list{
        "PUT /um/v1/users HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: 43\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"bread": "bernese mountain dog", "age": 4})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(put_list));
    CHECK_THAT(response, Catch::Contains("400") && Catch::Contains("Bad Request") && Catch::Contains("error"));
  }

  SECTION("PUT") {
    const std::string put_list{
        "PUT /um/v1/users HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: 49\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "Jane Doe", "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(put_list));
    CHECK_THAT(response,
               Catch::Contains("201") && Catch::Contains("Created") &&
                   Catch::Contains(fmt::format("ETag: {}\r\n", list.etag(2))) &&
                   Catch::Contains(nlohmann::json(user_management::user{2, "Jane Doe", "jane@example.com"}).dump()));
  }
}

TEST_CASE("User Endpoints") {
  database::user list;
  const auto user = list.add(R"##({"name": "John Doe", "email": "john@example.com"})##"_json);

  auto router = std::make_unique<router_t>();
  handler::user::fill::user(*router, list);
  http_server http_server(std::move(router));

  SECTION("GET 404") {
    const std::string get_user{
        "GET /um/v1/users/0 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(get_user));
    CHECK_THAT(response, Catch::Contains("404") && Catch::Contains("Not Found") && Catch::Contains("error") &&
                             Catch::Contains("user '0' does not exists"));
  }

  SECTION("GET") {
    const std::string get_user{
        "GET /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(get_user));
    CHECK_THAT(response, Catch::Contains("200") && Catch::Contains("OK") &&
                             Catch::Contains(fmt::format("ETag: {}\r\n", list.etag(1))) &&
                             Catch::Contains(nlohmann::json(user).dump()));
  }

  SECTION("GET 304") {
    const std::string get_user{
        "GET /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "If-None-Match: " +
        list.etag(1) +
        "\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(get_user));
    CHECK_THAT(response, Catch::Contains("304") && Catch::Contains("Not Modified") && Catch::EndsWith("\r\n\r\n"));
  }

  SECTION("DELETE 428") {
    const std::string del_user{
        "DELETE /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(del_user));
    CHECK_THAT(response, Catch::Contains("428") && Catch::Contains("Precondition Required") &&
                             Catch::Contains("error") &&
                             Catch::Contains("an 'If-Match <ETag>' header must be provided"));
  }

  SECTION("DELETE 412") {
    const std::string del_user{
        "DELETE /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "If-Match: dlfvbgayruefgba743t6374hnvjdbnq74gp\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(del_user));
    CHECK_THAT(response, Catch::Contains("412") && Catch::Contains("Precondition Failed") && Catch::Contains("error") &&
                             Catch::Contains("the user '1' was modified without you knowledge"));
  }

  SECTION("DELETE 404") {
    const std::string del_user{
        "DELETE /um/v1/users/0 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "If-Match: " +
        list.etag(1) +
        "\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(del_user));
    CHECK_THAT(response, Catch::Contains("404") && Catch::Contains("Not Found") && Catch::Contains("error") &&
                             Catch::Contains("user '0' does not exists"));
  }

  SECTION("DELETE") {
    const std::string del_user{
        "DELETE /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "If-Match: " +
        list.etag(1) +
        "\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(del_user));
    CHECK_THAT(response, Catch::Contains("204"));
  }

  SECTION("PATCH 428") {
    const std::string patch_list{
        "PATCH /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: 49\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "Jane Doe", "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(patch_list));
    CHECK_THAT(response, Catch::Contains("428") && Catch::Contains("Precondition Required") &&
                             Catch::Contains("error") &&
                             Catch::Contains("an 'If-Match <ETag>' header must be provided"));
  }

  SECTION("PATCH 412") {
    const std::string patch_list{
        "PATCH /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "If-Match: dlfvbgayruefgba743t6374hnvjdbnq74gp\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: 49\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "Jane Doe", "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(patch_list));
    CHECK_THAT(response, Catch::Contains("412") && Catch::Contains("Precondition Failed") && Catch::Contains("error") &&
                             Catch::Contains("the user '1' was modified without you knowledge"));
  }

  SECTION("PATCH 415") {
    const std::string patch_list{
        "PATCH /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Content-Type: text/plain\r\n"
        "Content-Length: 49\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "Jane Doe", "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(patch_list));
    CHECK_THAT(response, Catch::Contains("415") && Catch::Contains("Unsupported Media Type") &&
                             Catch::Contains("error") && Catch::Contains("Content-Type") &&
                             Catch::Contains("application/json"));
  }

  SECTION("PATCH 404") {
    const std::string patch_list{
        "PATCH /um/v1/users/0 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "If-Match: " +
        list.etag(1) +
        "\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: 49\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "Jane Doe", "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(patch_list));
    CHECK_THAT(response, Catch::Contains("404") && Catch::Contains("Not Found") && Catch::Contains("error") &&
                             Catch::Contains("user '0' does not exists"));
  }

  SECTION("PATCH 400") {
    const std::string patch_list{
        "PATCH /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "If-Match: " +
        list.etag(1) +
        "\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: 54\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "malformed JSON" "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(patch_list));
    CHECK_THAT(response, Catch::Contains("400") && Catch::Contains("Bad Request") && Catch::Contains("error"));
  }

  SECTION("PATCH") {
    const std::string patch_list{
        "PATCH /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "If-Match: " +
        list.etag(1) +
        "\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: 49\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "Jane Doe", "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(patch_list));
    CHECK_THAT(response,
               Catch::Contains("202") && Catch::Contains("Accepted") &&
                   Catch::Contains(fmt::format("ETag: {}\r\n", list.etag(1))) &&
                   Catch::Contains(nlohmann::json(user_management::user{1, "Jane Doe", "jane@example.com"}).dump()));
  }
}
