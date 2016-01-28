#!/bin/bash  
curl -X POST -H "content-type:application/json" -d '{"title":"Run remote client tests","tags":"test"}' http://localhost:8181/task/
