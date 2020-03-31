project(reactjs-from-cpp)
cmake_minimum_required(VERSION 3.8)

set(CMAKE_MODULE_PATH ${CMAKE_BINARY_DIR})
find_package(restinio 0.6 REQUIRED)
find_package(clara 1.1.5 REQUIRED)

add_executable(reactjs-from-cpp src/main.cpp)

target_link_libraries(reactjs-from-cpp restinio::restinio clara::clara)
