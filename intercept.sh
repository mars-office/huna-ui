#!/bin/sh
telepresence intercept huna-huna-ui --http-header=all --namespace huna --port 3000:http --env-file ./.env || true
