from cppstd_compat import cppstd_compat


def compatibility(conanfile):
    configs = cppstd_compat(conanfile)
    # TODO: Append more configurations for your custom compatibility rules
    return configs
