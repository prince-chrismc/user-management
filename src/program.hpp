
#include <set>
#include <stdexcept>
#include <string>

namespace user_management {
struct user {
  int id;
  std::string name;
  std::string email;
};

struct by_id : std::binary_function<user, user, bool> {
  bool operator()(const user &lhs, const user &rhs) { return lhs.id < rhs.id; }
};

struct user_list : std::set<user, by_id> {
  const user &get(int id) {
    auto retval = find({id});
    if (retval == end())
      throw std::runtime_error("requested user does not exist");
    return *retval;
  }
};
} // namespace user_management