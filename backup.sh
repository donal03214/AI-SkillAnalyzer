#!/bin/bash

DATE=$(date +%F)

mysqldump -h ai-project-db.chia2e860bsy.ap-southeast-2.rds.amazonaws.com -u admin -padmin12345 ai_project > backup_$DATE.sql

aws s3 cp backup_$DATE.sql s3://ai-project-uploads/

rm backup_$DATE.sql
