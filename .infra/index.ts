import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

interface BackendConfig {
    version: string;
}

let config = new pulumi.Config();
let backendConfig = config.requireObject<BackendConfig>("backend");

let backendListener = new awsx.lb.NetworkListener("backend", { port: 8080 });
let backend = new awsx.ecs.FargateService("backend", {
    taskDefinitionArgs: {
        containers: {
            backend: {
                image: `princechrismc.jfrog.io/user-management-docker/user-management-backend:${backendConfig.version}`,
                memory: 512,
                portMappings: [backendListener],
                command: ["dist", "-a", "0.0.0.0", "-p", "8080", "-n", "4"],
            },
        },
    },
});

let backendEndpoint = backendListener.endpoint;

let lb = new awsx.lb.NetworkListener("frontend", { port: 80 });
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
