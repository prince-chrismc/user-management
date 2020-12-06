// MIT license

#ifndef DATABASE_LOGGER_HPP_
#define DATABASE_LOGGER_HPP_

#include <spdlog/spdlog.h>

#ifdef CONSOLE_LOGGING
#include <spdlog/sinks/stdout_color_sinks.h>
#endif

#ifdef SYSLOG_LOGGING
#include <spdlog/sinks/syslog_sink.h>
#endif

namespace database {
struct logger {
  logger() {
#ifdef CONSOLE_LOGGING
    spdlog::stdout_color_mt("database")->set_level(spdlog::level::trace);
#endif
#ifdef SYSLOG_LOGGING
    spdlog::syslog_logger_mt("database", "um_database", LOG_PID)->set_level(spdlog::level::info);
#endif
  }
  template <typename FormatString, typename... Args>
  inline void trace(const FormatString &fmt, const Args &... args) const {
    spdlog::get("database")->trace(fmt, args...);
  }

  template <typename FormatString, typename... Args>
  inline void info(const FormatString &fmt, const Args &... args) const {
    spdlog::get("database")->info(fmt, args...);
  }

  template <typename FormatString, typename... Args>
  inline void warn(const FormatString &fmt, const Args &... args) const {
    spdlog::get("database")->warn(fmt, args...);
  }

  template <typename FormatString, typename... Args>
  inline void error(const FormatString &fmt, const Args &... args) const {
    spdlog::get("database")->error(fmt, args...);
  }
};
}  // namespace database

#endif  // DATABASE_LOGGER_HPP_
