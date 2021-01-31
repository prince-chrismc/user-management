import * as awsx from "@pulumi/awsx";

// The data layer for the application
// Use the 'image' property to point to a pre-built Docker image.
const backendListener = new awsx.elasticloadbalancingv2.NetworkListener("backend", { port: 8080 });
const backend = new awsx.ecs.FargateService("backend", {
    taskDefinitionArgs: {
        containers: {
            backend: {
                image: "princechrismc.jfrog.io/user-management-docker/user-management-backend:1.0.0-commit.224",
                memory: 512,
                portMappings: [backendListener],
                command: ["dist", "-a", "0.0.0.0", "-p", "8080", "-n", "4"],
            },
        },
    },
});

const backendEndpoint = backendListener.endpoint;

// Create a load balancer to listen for requests and route them to the container.
let lb = new awsx.lb.NetworkListener("frontend", { port: 80 });

// Define the service, building and publishing our "./web-app/Dockerfile", and using the load balancer.
let service = new awsx.ecs.FargateService("frontend", {
    desiredCount: 1,
    taskDefinitionArgs: {
        containers: {
            frontend: {
                image: awsx.ecs.Image.fromDockerBuild("frontend", {
                    context: "../web-app",
                    dockerfile: "../web-app/Dockerfile.multistage",
                    cacheFrom: { stages: ["install"] },
                    args: { api_url: backendEndpoint.apply(e => `"http://${e.hostname}:${e.port.toString()}"`) }
                }),
                memory: 512,
                portMappings: [lb],
            },
        },
    },
});

// Export the URL so we can easily access it.
export const url = lb.endpoint.hostname;
