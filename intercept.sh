#!/bin/sh
telepresence intercept huna-huna-ui --namespace huna --port 3000:http --env-file ./.env || true
