
def profile_plugin(profile):
    settings = profile.settings
    _check_msvc_runtime(settings)
    _check_correct_cppstd(settings)

def _check_linux_libc(settings):
    if settings.get("os") != "linux" or settings.get("compiler") != "gcc":
        return
    if settings.get("compiler.glibc") is None and settings.get("compiler.musl") is None:
        from conan.errors import ConanException
        raise ConanException("profiles for linux-gcc MUST define a lib implementation")

def _check_msvc_runtime(settings):
    if settings.get("compiler") == "msvc" and settings.get("compiler.runtime"):
        if settings.get("compiler.runtime_type") is None:
            from conan.errors import ConanException
            runtime = "Debug" if settings.get("build_type") == "Debug" else "Release"
            try:
                settings["compiler.runtime_type"] = runtime
            except ConanException:
                pass

def _check_correct_cppstd(settings):
    from conan.tools.scm import Version
    def _error(compiler, cppstd, min_version, version):
        from conan.errors import ConanException
        raise ConanException(f"The provided compiler.cppstd={cppstd} requires at least {compiler}"
                             f">={min_version} but version {version} provided")
    cppstd = settings.get("compiler.cppstd")
    version = settings.get("compiler.version")

    if cppstd and version:
        cppstd = cppstd.replace("gnu", "")
        version = Version(version)
        mver = None
        compiler = settings.get("compiler")
        if compiler == "gcc":
            mver = {"20": "8",
                    "17": "5",
                    "14": "4.8",
                    "11": "4.3"}.get(cppstd)
        elif compiler == "clang":
            mver = {"20": "6",
                    "17": "3.5",
                    "14": "3.4",
                    "11": "2.1"}.get(cppstd)
        elif compiler == "apple-clang":
            mver = {"20": "10",
                    "17": "6.1",
                    "14": "5.1",
                    "11": "4.5"}.get(cppstd)
        elif compiler == "msvc":
            mver = {"23": "193",
                    "20": "192",
                    "17": "191",
                    "14": "190"}.get(cppstd)
        if mver and version < mver:
            _error(compiler, cppstd, mver, version)
