// MIT License

#include "handlers/user_routes.hpp"
#include "unit_test/helpers.hpp"

#include <catch2/catch.hpp>
#include <restinio/all.hpp>

using router_t = restinio::router::express_router_t<>;
using traits_t = restinio::traits_t<restinio::asio_timer_manager_t, restinio::null_logger_t, router_t>;
using server_settings_t = restinio::server_settings_t<traits_t>;
using http_server_t = restinio::http_server_t<traits_t>;

TEST_CASE("List Endpoints") {
  user::database list;
  list.add(R"##({"name": "John Doe", "email": "john@example.com"})##"_json);

  auto router = std::make_unique<router_t>();
  router->http_get(handler::user::route::list, handler::user::get_list{list});
  router->http_post(handler::user::route::list, handler::user::add{list});

  http_server_t http_server{
      restinio::own_io_context(),
      server_settings_t{}.address("127.0.0.1").port(utest_default_port()).request_handler(std::move(router))};
  other_work_thread_for_server_t<http_server_t> other_thread{http_server};
  other_thread.run();

  SECTION("GET") {
    const std::string get_list{
        "GET /um/v1/users HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(get_list));
    CHECK_THAT(response, Catch::Contains(nlohmann::json(list).dump()));
  }

  SECTION("POST") {
    const std::string post_list{
        "POST /um/v1/users HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: 49\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "Jane Doe", "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(post_list));
    CHECK_THAT(response,
               Catch::Contains(nlohmann::json(user_management::user{2, "Jane Doe", "jane@example.com"}).dump()));
  }
}

TEST_CASE("User Endpoints") {
  user::database list;
  const auto user = list.add(R"##({"name": "John Doe", "email": "john@example.com"})##"_json);

  auto router = std::make_unique<router_t>();
  router->http_get(handler::user::route::user, handler::user::get_user{list});
  router->http_delete(handler::user::route::user, handler::user::remove{list});
  router->add_handler(restinio::http_method_patch(), handler::user::route::user, handler::user::edit{list});

  http_server_t http_server{
      restinio::own_io_context(),
      server_settings_t{}.address("127.0.0.1").port(utest_default_port()).request_handler(std::move(router))};
  other_work_thread_for_server_t<http_server_t> other_thread{http_server};
  other_thread.run();

  SECTION("GET 200") {
    const std::string get_user{
        "GET /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(get_user));
    CHECK_THAT(response, Catch::Contains(nlohmann::json(user).dump()));
  }

  SECTION("GET 404") {
    const std::string get_user{
        "GET /um/v1/users/0 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(get_user));
    CHECK_THAT(response, Catch::Contains("404") && Catch::Contains("Not Found") && Catch::Contains("error") /*&&
                             Catch::Contains("user does not exists")*/);
  }

  SECTION("DELETE") {
    const std::string get_user{
        "DELETE /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Connection: close\r\n"
        "\r\n"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(get_user));
    CHECK_THAT(response, Catch::Contains("204"));
  }

  SECTION("PATCH") {
    const std::string post_list{
        "PATCH /um/v1/users/1 HTTP/1.0\r\n"
        "From: unit-test\r\n"
        "User-Agent: unit-test\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: 49\r\n"
        "Connection: close\r\n"
        "\r\n"
        R"##({"name": "Jane Doe", "email": "jane@example.com"})##"};

    std::string response;
    REQUIRE_NOTHROW(response = do_request(post_list));
    CHECK_THAT(response,
               Catch::Contains(nlohmann::json(user_management::user{1, "Jane Doe", "jane@example.com"}).dump()));
  }
}
