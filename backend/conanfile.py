from conans import ConanFile, CMake
from six import StringIO
from os import path, getcwd


class UserManagement(ConanFile):
    name = "user-management"
    version = "1.0.0-dev.0"
    license = "MIT"
    url = "https://gitlab.com/prince-chrismc/user-management"
    description = "An open-source application delivering a responsive user management experience."
    settings = "os", "compiler", "build_type", "arch"
    generators = "cmake_find_package"
    exports_sources = "CMakeLists.txt", "cmake/*", "src/*", "include/*"
    default_options = {"restinio:with_openssl": True}

    def init(self):
        # Append the commit hash for the build info
        buffer = StringIO()
        self.run("git rev-parse --short HEAD", output=buffer)
        self.version += '+'
        self.version += buffer.getvalue()

    def export_sources(self):
        schema_source = path.normpath(path.join(getcwd(), ".."))
        self.copy("api/schema/*.json", src=schema_source)

    def build_requirements(self):
        self.build_requires("catch2/2.13.0")

    def requirements(self):
        self.requires("restinio/0.6.10")
        self.requires("json-schema-validator/2.1.0")
        self.requires("lyra/1.4.0")

    def build(self):
        cmake = CMake(self)
        cmake.definitions["CONAN_SETUP"] = False
        cmake.definitions["SCHEMAS_ROOT"] = "."
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
