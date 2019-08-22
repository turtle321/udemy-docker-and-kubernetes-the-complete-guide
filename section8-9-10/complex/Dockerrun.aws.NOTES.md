```json
{
  "AWSEBDockerrunVersion": 2,
  "containerDefinitions": [
    {
      "name": "client",
      "image": "nimiq/multi-client",
      "hostname": "client",
      "essential": false // Do not shutdown other containers if this dies.
    },
    {
      "name": "server",
      "image": "nimiq/multi-server",
      "hostname": "api",
      "essential": false
    },
    {
      "name": "worker",
      "image": "nimiq/multi-worker",
      "hostname": "worker",
      "essential": false
    },
    {
      "name": "nginx",
      "image": "nimiq/multi-nginx",
      "hostname": "worker",
      "essential": true, // Shutdown other containers if this fails. One essential container is required.
      "portMappings": [{ "hostPort": 80, "containerPort": 80 }],
      "links": ["client", "server"] // Required in order to link together containers.
    }
  ]
}
```