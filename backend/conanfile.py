from conans import ConanFile, CMake


class UserManagement(ConanFile):
    name = "user-management"
    version = "1.0.0-dev.0"
    license = "MIT"
    url = "https://gitlab.com/prince-chrismc/user-management"
    description = "An open-source application delivering a responsive user management experience."
    settings = "os", "compiler", "build_type", "arch"
    generators = "cmake_find_package"
    exports_sources = "CMakeLists.txt", "cmake/*", "src/*", "include/*", "conanfile.txt"

    def requirements(self):
        self.requires("fmt/7.0.3")
        self.requires("openssl/1.1.1g")
        self.requires("restinio/0.6.8.1")
        self.requires("json-schema-validator/2.1.0")
        self.requires("lyra/1.4.0")

    def build(self):
        cmake = CMake(self)
        cmake.configure(source_folder=".")
        cmake.build()
