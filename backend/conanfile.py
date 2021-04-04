from conans import ConanFile, CMake
from os import path, getcwd


class UserManagementConanFile(ConanFile):
    name = "user-management"
    license = "MIT"
    url = "https://github.com/prince-chrismc/user-management"
    description = "An open-source application delivering a responsive user management experience."
    settings = "os", "compiler", "build_type", "arch"
    generators = "cmake_find_package"
    exports_sources = "CMakeLists.txt", "cmake/*", "src/*", "include/*"
    options = {"logging": ["console", "syslog"]}
    default_options = {"logging": "syslog", "restinio:with_openssl": True}

    def export_sources(self):
        schema_source = path.normpath(path.join(getcwd(), ".."))
        self.copy("api/schema/*.json", src=schema_source)

    def build_requirements(self):
        self.build_requires("catch2/2.13.4")

    def requirements(self):
        self.requires("restinio/0.6.13")
        self.requires("json-schema-validator/2.1.0")
        self.requires("lyra/1.5.0")
        self.requires("spdlog/1.8.5")

    def build(self):
        cmake = CMake(self)
        cmake.definitions["CONAN_SETUP"] = False
        cmake.definitions["SCHEMAS_ROOT"] = "."
        cmake.definitions["LOGGING"] = self.options.logging
        cmake.configure()
        cmake.build()

    def package(self):
        self.copy("*.hpp", src=".")
        self.copy("*.lib", dst="lib", keep_path=False)
        self.copy("*.dll", dst="bin", keep_path=False)
        self.copy("*.so", dst="lib", keep_path=False)
        self.copy("*.dylib", dst="lib", keep_path=False)
        self.copy("*.a", dst="lib", keep_path=False)
        self.copy("*user_database_app", dst="bin", keep_path=False)

    def package_info(self):
        self.cpp_info.libs = ["user-management"]

    def deploy(self):
        self.copy("user_database_app", src="bin", dst="bin")
