// MIT license

#ifndef UTILITY_SERVER_LOGGER
#define UTILITY_SERVER_LOGGER

#include <spdlog/spdlog.h>

#ifdef CONSOLE_LOGGING
#include <spdlog/sinks/stdout_color_sinks.h>
#endif

#ifdef SYSLOG_LOGGING
#include <spdlog/sinks/syslog_sink.h>
#endif

struct server_logger {
  server_logger() {
#ifdef CONSOLE_LOGGING
    spdlog::stdout_color_mt("server")->set_level(spdlog::level::trace);
#endif
#ifdef SYSLOG_LOGGING
    spdlog::syslog_logger_mt("server", "um_app_server", LOG_PID)->set_level(spdlog::level::info);
#endif
  }
  template <typename Message_Builder>
  void trace(Message_Builder&& msg_builder) const {
    spdlog::get("server")->trace(msg_builder());
  }

  template <typename Message_Builder>
  void info(Message_Builder&& msg_builder) const {
    spdlog::get("server")->info(msg_builder());
  }

  template <typename Message_Builder>
  void warn(Message_Builder&& msg_builder) const {
    spdlog::get("server")->warn(msg_builder());
  }

  template <typename Message_Builder>
  void error(Message_Builder&& msg_builder) const {
    spdlog::get("server")->error(msg_builder());
  }
};

#endif  // UTILITY_SERVER_LOGGER
