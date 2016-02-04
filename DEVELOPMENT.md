## Redis keys

### Project structure

This is the structure of the object we store in Redis, keep this format in frotnend and backend

```
{
"name":"ip-change",
"repository":"git@bitbucket.org:coconauts/coconauts-ci.git",
"commands":"cd \"/home/pi/projects/IP-change\"\npython ip_change.py",
"frequency":{
  "value":"10",
  "unit":"m"},
"logSuccess":"false"
}
```

### applications

type: Map

Stores all application in stringified JSON with their configurations

Example:
```
hgetall applications
1) "cron"
2) "{\"name\":\"cron\",\"repo\":\"\",\"commands\":\"ls\",\"frequency\":{\"value\":\"m\",\"unit\":\"2\"}}"
```

### last_exec

type: Map

Stores last execution time in milliseconds per application

Example:
```
hgetall applications
1) "cron"
2) "1453978715548"
```

### build_status

type: Map

Stores build status, project name, log and time

Example:
```
hgetall build_status
25) "cron:1453985340"
26) "{\"status\":\"success\",\"time\":1453985340085,\"output\":\"background\\nci.js\\nconfig.json\\ncontrollers\\nhelpers\\nnode_modules\\npackage.json\\npublic\\nREADME.md\\nservices\\n\"}"
```
