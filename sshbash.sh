#!/usr/bin/expect -f
spawn ssh root@103.153.72.230 "bash -s " < ./roll-back-image-site.sh
expect "password:"
sleep 1

send "vrMAy2HJAmSxf3aDNNESmP8\r"
interact