import json


def main():
    matrix = {"include": []}
    with open("build_order.json", "r") as read_file:
        data = json.load(read_file)
        for level in data:
            for reference in level:
                matrix["include"].append({"reference": reference[0]})

        if len(matrix["include"]) == 0:
            matrix["include"].append({"reference": "null"})

        with open("matrix.json", "w") as write_file:
            json.dump(matrix, write_file)


if __name__ == "__main__":
    main()
