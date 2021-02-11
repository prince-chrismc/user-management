# User Management Deployment

## Setup

### Pulumi Configuration

Select the target stack

```sh
pulumi stack select dev
```

### Dependencies

Install dependencies

```sh
npm install
```

## Development

Select back-end version

```sh
pulumi config set --path backend.version latest
```

Preview deployment

```sh
pulumi preview
```

### Updating dependencies

```sh
npm update
```

## Usage

Deploy

```sh
pulumi up
```
