// MIT license

#include "logger.hpp"

#if defined(CONSOLE_LOGGING) == defined(SYSLOG_LOGGING)  // Niether or both
#error "One logging method must be configured!"
#endif

#ifdef CONSOLE_LOGGING
#include <spdlog/sinks/stdout_color_sinks.h>
#endif

#ifdef SYSLOG_LOGGING
#include <spdlog/sinks/syslog_sink.h>
#endif

logger::logger(std::string name) : name_(std::move(name)) {
      if (spdlog::get(name_) == nullptr) {
#ifdef CONSOLE_LOGGING
      spdlog::stdout_color_mt(name_)->set_level(spdlog::level::trace);
#endif
#ifdef SYSLOG_LOGGING
      spdlog::syslog_logger_mt(name_, "um_" + name_, LOG_PID)->set_level(spdlog::level::info);
#endif
    }
}
