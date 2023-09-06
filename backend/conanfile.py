from conan import ConanFile
from conan.tools.cmake import CMake, CMakeToolchain, CMakeDeps, cmake_layout
from conan.tools.files import copy, update_conandata
from conan.tools.scm import Git
from os import path

required_conan_version = ">=1.51.0"

class UserManagementConanFile(ConanFile):
    name = "user-management"
    license = "MIT"
    url = "https://github.com/prince-chrismc/user-management"
    description = "An open-source application delivering a responsive user management experience."
    package_type = "application"
    settings = "os", "compiler", "build_type", "arch"
    options = {"logging": ["console", "syslog"]}
    default_options = {"logging": "syslog", "restinio/*:with_openssl": True}

    def layout(self):
        # Describe mono repo structure
        self.folders.root = ".."
        self.folders.subproject = "backend"
        cmake_layout(self)

    def export(self):
        git = Git(self, self.recipe_folder)
        scm_url, scm_commit = git.get_remote_url(), git.get_commit()
        update_conandata(self, {"sources": {"commit": scm_commit, "url": scm_url}})

    def export_sources(self):
        source_folder = path.normpath(path.join(self.recipe_folder, ".."))
        for pattern in ["CMakeLists.txt", "cmake/*", "src/*", "include/*"]:
            copy(self, path.join("backend", pattern), source_folder, self.export_sources_folder)
        copy(self, "api/schema/*.json", source_folder, self.export_sources_folder)

    def generate(self):
        toolchain = CMakeToolchain(self)
        toolchain.variables["CONAN_SETUP"] = False
        toolchain.variables["SCHEMAS_ROOT"] = ".."
        toolchain.variables["LOGGING"] = self.options.logging
        toolchain.generate()
        deps = CMakeDeps(self)
        deps.generate()

    def build_requirements(self):
        self.test_requires("catch2/2.13.9")

    def requirements(self):
        self.requires("restinio/0.6.15")
        self.requires("json-schema-validator/2.1.0")
        self.requires("lyra/1.6.0")
        self.requires("spdlog/1.10.0")

    def build(self):
        cmake = CMake(self)
        cmake.configure()
        cmake.build()

    def package(self):
        # TODO(prince-chrismc): Revisit requirements when we look into deploying
        copy(self, "*.hpp", src=path.join(self.source_folder, "include"), dst=path.join(self.package_folder, "include"))
        copy(self, "*user_database_app", src=path.join(self.build_folder, "src"), dst=path.join(self.package_folder, "bin"), keep_path=False)

    def deploy(self):
        self.copy("user_database_app", src="bin", dst="bin")
