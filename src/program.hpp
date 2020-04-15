
#include <map>
#include <stdexcept>
#include <string>

namespace user_management {
struct user {
  int id;
  std::string name;
  std::string email;
};

struct user_list : std::map<int, user> {
  user &get(int id) { return at(id); }

  user &add(std::string name, std::string email) {
    const auto id = end()->first + 1;
    emplace(std::make_pair(id, user{id, std::move(name), std::move(email)}));
    return get(id);
  }

  user remove(int id) {
    const auto it = find(id);
    const auto copy = it->second;
    erase(it);
    return copy;
  }
};
} // namespace user_management