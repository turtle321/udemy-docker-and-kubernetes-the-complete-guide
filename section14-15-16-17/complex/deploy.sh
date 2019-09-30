#!/bin/bash

echo "DEPLOYING..."

# Apply all kubernetes (declarative) config.
###kubectl apply -f k8s

# Imperative command to use the latest image.
# Note: this is the best way to use an updated Docker Hub image.
# The alternative would be editing the config files in the `k8s` dir
# which is indeed not feasible in a automatic deployment.
###kubectl set image deployments/server-deployment server=nimiq/multi-server:$SHA
###kubectl set image deployments/client-deployment client=nimiq/multi-client:$SHA
###kubectl set image deployments/worker-deployment worker=nimiq/multi-worker:$SHA
