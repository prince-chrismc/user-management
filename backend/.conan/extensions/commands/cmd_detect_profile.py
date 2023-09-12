import os
import platform
import shutil

from conans.model.profile import Profile
from conan.cli.command import conan_command
from conans.util.files import save

@conan_command(group="User Management")
def detect_profile(conan_api, parser, *args):
    """
    Best guess at the settings and tools installed in the system
    """

    #https://github.com/conan-io/conan/blob/e77134f7be8c5cba8c3ff7baaed44cbb7b454f54/conan/api/subapi/profiles.py#L91
    detected_profile: Profile =  conan_api.profiles.detect()

    profile_name = "unknown"
    # https://github.com/conan-io/conan/blob/e77134f7be8c5cba8c3ff7baaed44cbb7b454f54/conans/client/conf/detect.py#L364
    platform_name = platform.system()
    if platform_name == "linux":
        detected_profile.settings["compiler.glibc"] = None
        detected_profile.settings["compiler.musl"] = None
        pass
    elif platform_name == "Darwin":
        detected_profile.settings["os.version"] = "1.10"
        pass

    cmake_path = shutil.which("cmake")
    if cmake_path:
        detect_profile.system_tools.append("cmake/1.0.0")

    # https://github.com/conan-io/conan/blob/e77134f7be8c5cba8c3ff7baaed44cbb7b454f54/conan/cli/commands/profile.py#L61C16-L61C16
    profile_pathname = conan_api.profiles.get_path(profile_name, os.getcwd(), exists=False)
    contents = detected_profile.dumps()
    save(profile_pathname, contents)