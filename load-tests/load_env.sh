ENV_PATH="$(pwd)/../.env"

for assignment in $(cat "$ENV_PATH"); do
  echo "$assignment"
done | awk '/=/ {print $1}'
