// MIT license

#ifndef UTILITY_SERVER_LOGGER
#define UTILITY_SERVER_LOGGER

#include "logging/logger.hpp"

struct server_logger : logger {
  server_logger() : logger{"app_server"} {}

  template <typename Message_Builder>
  void trace(Message_Builder&& msg_builder) const {
    logger::trace(msg_builder());
  }

  template <typename Message_Builder>
  void info(Message_Builder&& msg_builder) const {
    logger::info(msg_builder());
  }

  template <typename Message_Builder>
  void warn(Message_Builder&& msg_builder) const {
    logger::warn(msg_builder());
  }

  template <typename Message_Builder>
  void error(Message_Builder&& msg_builder) const {
    logger::error(msg_builder());
  }
};

#endif  // UTILITY_SERVER_LOGGER
