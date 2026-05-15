import hashlib

result = []

with open(r"D:\all_notes\server_logs.txt", "r", encoding="utf-8") as f:
    for line in f:
        # Ignore unwanted lines
        if line.startswith("SERVER") or line.startswith("-"):
            continue

        # Normalize line to EXACTLY include only '\n'
        clean_line = line.rstrip("\r\n") + "\n"

        # MD5 hash of full line INCLUDING newline
        hash_val = hashlib.md5(clean_line.encode("utf-8")).hexdigest()

        # Keep only if last char is digit
        if hash_val[-1].isdigit():
            if len(clean_line) > 4:
                result.append(clean_line[4])  # 5th character

final_output = "".join(result)

print(final_output)
print("Length:", len(final_output))