
from conan.tools.build import supported_cppstd
from conan.errors import ConanException


def cppstd_compat(conanfile):
    # It will try to find packages with all the cppstd versions

    compiler = conanfile.settings.get_safe("compiler")
    compiler_version = conanfile.settings.get_safe("compiler.version")
    cppstd = conanfile.settings.get_safe("compiler.cppstd")
    if not compiler or not compiler_version or not cppstd:
        return []
    base = dict(conanfile.settings.values_list)
    cppstd_possible_values = supported_cppstd(conanfile)
    if cppstd_possible_values is None:
        conanfile.output.warning(f'No cppstd compatibility defined for compiler "{compiler}"')
        return []
    ret = []
    for _cppstd in cppstd_possible_values:
        if _cppstd is None or _cppstd == cppstd:
            continue
        configuration = base.copy()
        configuration["compiler.cppstd"] = _cppstd
        ret.append({"settings": [(k, v) for k, v in configuration.items()]})

    return ret
