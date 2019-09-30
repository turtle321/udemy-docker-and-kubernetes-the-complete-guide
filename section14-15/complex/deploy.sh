#!/bin/bash

# Use 2 tags for each image: the classic lates plus the git SHA.
# The sha is added in order to tell kubernetes to use an image
# with a new tag.
# If instead we used latest, kubernetes would think to already
# have latest, even tho latest was updated.
# In other words: kubernetes does not re-apply an image if
# you push an updated version to Docker Hub. That's why you need
# to use unique tags.
# Note: $SHA is an anv var that we defined inside `.travis.yml`.
docker build -t nimiq/multi-client:latest -t nimiq/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t nimiq/multi-server:latest -t nimiq/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t nimiq/multi-worker:latest -t nimiq/multi-worker:$SHA -f ./worker/Dockerfile ./worker

# Publish to Docker Hub.
docker push nimiq/multi-client:latest
docker push nimiq/multi-server:latest
docker push nimiq/multi-worker:latest
docker push nimiq/multi-client:$SHA
docker push nimiq/multi-server:$SHA
docker push nimiq/multi-worker:$SHA

# Apply all kubernetes (declarative) config.
kubectl apply -f k8s

# Imperative command to use the latest image.
# Note: this is the best way to use an updated Docker Hub image.
# The alternative would be editing the config files in the `k8s` dir
# which is indeed not feasible in a automatic deployment.
kubectl set image deployments/server-deployment server=nimiq/multi-server:$SHA
kubectl set image deployments/client-deployment client=nimiq/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=nimiq/multi-worker:$SHA
