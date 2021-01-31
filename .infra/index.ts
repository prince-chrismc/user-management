import * as awsx from "@pulumi/awsx";

// Create a load balancer to listen for requests and route them to the container.
let lb = new awsx.lb.NetworkListener("frontend", { port: 80 });

// Define the service, building and publishing our "./web-app/Dockerfile", and using the load balancer.
let service = new awsx.ecs.FargateService("frontend", {
    desiredCount: 1,
    taskDefinitionArgs: {
        containers: {
            frontend: {
                image: awsx.ecs.Image.fromPath("frontend", "../web-app"),
                memory: 512,
                portMappings: [ lb ],
            },
        },
    },
});

// Export the URL so we can easily access it.
export const url = lb.endpoint.hostname;
