#!/bin/sh
telepresence connect -n huna
telepresence intercept huna-huna-ui --port 3000:http --env-file ./.env || true
