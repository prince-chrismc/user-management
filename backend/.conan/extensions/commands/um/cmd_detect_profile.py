import os
import platform
import shutil
import re

from conan.api.output import ConanOutput, cli_out_write
from conans.model.profile import Profile
from conan.cli.command import conan_command
from conans.util.files import save
from conan.errors import ConanException
from conans.util.runners import detect_runner

def detect_macos_version():
        # https://www.cyberciti.biz/faq/mac-osx-find-tell-operating-system-version-from-bash-prompt/
        ret, out = detect_runner("sw_vers -productVersion")
        if ret != 0:
            return None
        
        installed_version = re.search(r"([0-9]+(\.[0-9])?)", out).group()
        if installed_version:
            ConanOutput().success(f"Found osx sw_vers {installed_version}")
            return installed_version

def detect_tool_version(tool_name):
    tool_path = shutil.which(tool_name)
    if not tool_path:
        ConanOutput().warning(f"Could not find {tool_name} available in the system")
        return None
    
    ret, out = detect_runner(f"{tool_path} --version")
    if ret != 0:
        raise ConanException(f"Unable to determine the version of {tool_name} that's installed")
    
    installed_version = re.search(r"([0-9]+(\.[0-9]+)+)", out).group()
    if installed_version:
        ConanOutput().success(f"Found {tool_name} {installed_version}")
        return installed_version

def detect_cmake_version():
    return detect_tool_version("cmake")

def detect_ninja_version():
    return detect_tool_version("ninja")

@conan_command(group="User Management")
def detect_profile(conan_api, parser, *args):
    """
    Best guess at the settings and tools installed in the system
    """
    parser.add_argument("-f", "--force", action='store_true', help="Overwrite if exists")
    args = parser.parse_args(*args)

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
        detected_profile.settings["os.version"] = detect_macos_version()
        pass

    cmake_version = detect_cmake_version()
    if cmake_version:
        detected_profile.system_tools.append(f"cmake/{cmake_version}")

    ninja_version = detect_ninja_version()
    if ninja_version:
        detected_profile.system_tools.append(f"ninja/{ninja_version}")
    
    contents = detected_profile.dumps()
    cli_out_write("Detected profile:")
    cli_out_write(contents)

    # https://github.com/conan-io/conan/blob/e77134f7be8c5cba8c3ff7baaed44cbb7b454f54/conan/cli/commands/profile.py#L61C16-L61C16
    profile_pathname = conan_api.profiles.get_path(profile_name, os.getcwd(), exists=False)
    if not args.force and os.path.exists(profile_pathname):
        raise ConanException(f"Profile '{profile_pathname}' already exists")

    save(profile_pathname, contents)