set -e
echo "Deploying craglog"

# parse command line args
while getopts t:p:f: flag
do
    case "${flag}" in
        t) DOCKER_TAG=${OPTARG};;
        p) CR_PAT=${OPTARG};;
    esac
done

DOCKER_IMAGE="ghcr.io/johncalvinroberts/craglog:$DOCKER_TAG"
echo "DOCKER_IMAGE: $DOCKER_IMAGE"
echo "Pulling docker image."
CONTAINER_1_NAME="craglog-backend-1"
CONTAINER_2_NAME="craglog-backend-1"

# set gh container registry personal access token and login
# uncomment next line if docker login expires
# echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

# TODO logs?
docker pull $DOCKER_IMAGE
echo "Stopping and starting new containers"
docker container stop $CONTAINER_1_NAME
docker container rm $CONTAINER_1_NAME
docker run -p 3001:3000 -d --name $CONTAINER_1_NAME $DOCKER_IMAGE
docker container stop $CONTAINER_2_NAME
docker container rm $CONTAINER_2_NAME
docker run -p 3000:3000 -d --name $CONTAINER_2_NAME $DOCKER_IMAGE

# reload caddy
echo "Reloading Caddy."
curl -X POST "http://localhost:2019/load" \
  -H "Content-Type: text/caddyfile" \
  --data-binary @Caddyfile

echo "Done deploying."