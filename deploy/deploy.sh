set -e
echo "Deploying craglog"

# parse command line args
while getopts t:a:f: flag
do
    case "${flag}" in
        t) DOCKER_TAG=${OPTARG};;
    esac
done

DOCKER_IMAGE="ghcr.io/johncalvinroberts/craglog:$DOCKER_TAG"


# set gh container registry personal access token and login
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

docker pull $DOCKER_IMAGE
docker run $DOCKER_IMAGE -p 3001:3000
docker run $DOCKER_IMAGE -p 3000:3000

# reload caddy
curl -X POST "http://localhost:2019/load" \
  -H "Content-Type: text/caddyfile" \
  --data-binary @Caddyfile