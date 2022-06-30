// MIT License

#include "user_routes.hpp"

#include <restinio/cast_to.hpp>
#include <restinio/helpers/http_field_parsers/content-type.hpp>
#include <utility>

#include "logging/logger.hpp"
#include "utility/response_builder.hpp"

class unsupported_media_type : public std::runtime_error {
  using runtime_error::runtime_error;
};

class precondition_required : public std::runtime_error {
  using runtime_error::runtime_error;
};

class precondition_failed : public std::runtime_error {
  using runtime_error::runtime_error;
};

using restinio::http_field;
namespace {
bool conditional_matching(const handler::request_handle &req, http_field field, const std::string &etag) {
  const auto maybe_match = req->header().opt_value_of(field);
  if (maybe_match.has_value()) {
    return maybe_match.value() == etag;
  }

  return false;
}

void verify_application_json(const handler::request_handle &req) {
  namespace hfp = restinio::http_field_parsers;

  // Try to find Content-Type field.
  const auto content_type = req->header().value_of(http_field::content_type);
  const auto parsed_value = hfp::content_type_value_t::try_parse(content_type);
  if (!parsed_value) {  // Content-Type is successfuly parsed.
    throw unsupported_media_type("The value of 'Content-Type' was invalid!");
  }

  if ("application" == parsed_value->media_type.type && "json" == parsed_value->media_type.subtype) {
    return;
  }

  throw unsupported_media_type(
      fmt::format("The value of 'Content-Type' was '{}/{}' which is not a unsupported media type."
                  " Only 'application/json' is supported",
                  parsed_value->media_type.type, parsed_value->media_type.subtype));
}

void verify_if_match(const handler::request_handle &req) {
  if (!req->header().has_field(http_field::if_match)) {
    throw precondition_required("an 'If-Match <ETag>' header must be provided");
  }
}

void verify_etag(const handler::request_handle &req, user_management::user_key id, const std::string &etag) {
  verify_if_match(req);
  if (conditional_matching(req, http_field::if_match, etag)) return;

  throw precondition_failed(fmt::format("the user '{}' was modified without you knowledge. New 'ETag' is: {}", id, etag));
}
}  // namespace

using user_management::json;
using user_management::user_does_not_exist;
using user_management::user_key;

namespace handler {
namespace user {
static const logger log{"handler_user_routes"};

namespace fill {
void list(router &router, database &db) {
  router.http_get(route::list, get_list{db});
  router.http_put(route::list, add{db});
  router.add_handler(restinio::http_method_options(), route::list, &preflight::list);
}
void user(router &router, database &db) {
  router.http_get(route::user, handler::user::get_user{db});
  router.http_delete(route::user, remove{db});
  router.add_handler(restinio::http_method_patch(), route::user, edit{db});
  router.add_handler(restinio::http_method_options(), route::user, &preflight::user);
}
}  // namespace fill

request_status add::operator()(const request_handle &req, route_params /*params*/) {
  log.trace("processing add operation");
  try {
    verify_application_json(req);
    const auto user = db_.add(json::parse(req->body()));
    log.info("add operation completed");
    return response::builders::list(req, restinio::status_created())
        .append_header(http_field::etag, db_.etag(user.id))
        .set_body(json(user).dump())
        .done();
  } catch (const unsupported_media_type &e) {
    log.warn("add operation block by unsupported media type");
    return response::unsupported_media_type(req).set_body(e).done();
  } catch (const std::exception &e) {
    log.error("add operation failed");
    return response::error_builder<std::exception>(req).set_body(e).done();
  }
}

request_status remove::operator()(const request_handle &req, route_params params) {
  log.trace("processing remove operation");
  try {
    const auto id = restinio::cast_to<user_key>(params["id"]);
    verify_etag(req, id, db_.etag(id));
    db_.remove(id);
    log.info("remove operation completed");
    return response::builders::user(req, restinio::status_no_content()).done();
  } catch (const precondition_required &e) {
    log.warn("remove operation block by missing precondition");
    return response::precondition_required(req).set_body(e).done();
  } catch (const precondition_failed &e) {
    log.warn("remove operation block by failed precondition");
    return response::precondition_failed(req).set_body(e).done();
  } catch (const user_does_not_exist &e) {
    log.warn("remove operation block by invalid user id");
    return response::not_found(req).set_body(e).done();
  }
}

request_status edit::operator()(const request_handle &req, route_params params) {
  log.trace("processing edit operation");
  try {
    verify_application_json(req);
    const auto id = restinio::cast_to<user_key>(params["id"]);
    verify_etag(req, id, db_.etag(id));
    const auto user = db_.edit(id, json::parse(req->body()));
    log.info("edit operation completed");
    return response::builders::user(req, restinio::status_accepted())
        .append_header(http_field::last_modified, db_.last_modified(user.id))
        .append_header(http_field::etag, db_.etag(user.id))
        .set_body(json(user).dump())
        .done();
  } catch (const unsupported_media_type &e) {
    log.warn("edit operation block by unsupported media type");
    return response::unsupported_media_type(req).set_body(e).done();
  } catch (const precondition_required &e) {
    log.warn("edit operation block by missing precondition");
    return response::precondition_required(req).set_body(e).done();
  } catch (const precondition_failed &e) {
    log.warn("edit operation block by failed precondition");
    return response::precondition_failed(req).set_body(e).done();
  } catch (const user_does_not_exist &e) {
    log.warn("edit operation block by invalid user id");
    return response::not_found(req).set_body(e).done();
  } catch (const std::exception &e) {
    log.error("edit operation failed");
    return response::error_builder<std::exception>(req).set_body(e).done();
  }
}

request_status get_user::operator()(const request_handle &req, route_params params) {
  log.trace("processing get user operation");
  try {
    const auto user = db_.get(restinio::cast_to<user_key>(params["id"]));
    log.info("get user operation completed");
    if (conditional_matching(req, http_field::if_none_match, db_.etag(user.id))) {
      log.trace("get user operation cache hit");
      return response::builders::user(req, restinio::status_not_modified())
          .append_header(http_field::etag, db_.etag(user.id))
          .append_header(http_field::last_modified, db_.last_modified(user.id))
          .done();
    }
    return response::builders::user(req)
        .append_header(http_field::etag, db_.etag(user.id))
        .append_header(http_field::last_modified, db_.last_modified(user.id))
        .set_body(json(user).dump())
        .done();
  } catch (const user_does_not_exist &e) {
    log.warn("get user operation block by invalid user id");
    return response::not_found(req).set_body(e).done();
  }
}

request_status get_list::operator()(const request_handle &req, route_params /*params*/) {
  log.trace("processing get list operation");
  if (conditional_matching(req, http_field::if_none_match, db_.etag())) {
    log.trace("get list operation cache hit");
    return response::builders::list(req, restinio::status_not_modified()).done();
  }
  return response::builders::list(req)
      .append_header(http_field::last_modified, db_.last_modified())
      .append_header(http_field::etag, db_.etag())
      .set_body(json(db_).dump())
      .done();
}

namespace preflight {
request_status list(const request_handle &req, route_params /*params*/) {
  log.trace("returning list preflight response");
  return req->create_response(restinio::status_no_content())
      .append_header(http_field::access_control_allow_origin, "*")
      .append_header(http_field::access_control_allow_methods, "GET, PUT")
      .append_header(http_field::access_control_allow_headers, "Content-Type, If-None-Match")
      .append_header(http_field::access_control_max_age, "86400")
      .done();
}
request_status user(const request_handle &req, route_params /*params*/) {
  log.trace("returning user preflight response");
  return req->create_response(restinio::status_no_content())
      .append_header(http_field::access_control_allow_origin, "*")
      .append_header(http_field::access_control_allow_methods, "GET, PATCH, DELETE")
      .append_header(http_field::access_control_allow_headers, "Content-Type, If-Match, If-None-Match")
      .append_header(http_field::access_control_max_age, "86400")
      .done();
}
}  // namespace preflight
}  // namespace user
}  // namespace handler
