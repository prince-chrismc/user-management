
find_package(Catch2 1.12.1 REQUIRED)

add_executable(program-test "main.cpp"
 "../src/program.hpp" "program.cpp"
  "${SCHEMAS_HEADER}")

target_link_libraries(program-test
Catch2::Catch2
restinio::restinio
nlohmann_json_schema_validator::nlohmann_json_schema_validator)
