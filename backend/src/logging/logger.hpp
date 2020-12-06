// MIT license

#ifndef LOGGING_LOGGER_HPP_
#define LOGGING_LOGGER_HPP_

#include <spdlog/spdlog.h>

class logger {
  const std::string name_;

 public:
  logger(std::string name);

  template <typename FormatString, typename... Args>
  inline void trace(const FormatString &fmt, const Args &... args) const {
    spdlog::get(name_)->trace(fmt, args...);
  }

  template <typename FormatString, typename... Args>
  inline void info(const FormatString &fmt, const Args &... args) const {
    spdlog::get(name_)->info(fmt, args...);
  }

  template <typename FormatString, typename... Args>
  inline void warn(const FormatString &fmt, const Args &... args) const {
    spdlog::get(name_)->warn(fmt, args...);
  }

  template <typename FormatString, typename... Args>
  inline void error(const FormatString &fmt, const Args &... args) const {
    spdlog::get(name_)->error(fmt, args...);
  }
};

#endif  // LOGGING_LOGGER_HPP_
