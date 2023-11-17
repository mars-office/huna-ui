#!/bin/sh
telepresence connect -n huna
telepresence intercept huna-huna-ui --port 3000:http --to-pod 8181 --env-file ./.env || true
