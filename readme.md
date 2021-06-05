# User Management [![Docs](https://img.shields.io/badge/API%20Documentation-master-blue)](https://prince-chrismc.github.io/user-management/)

An open-source application delivering a responsive user management experience.

<p align="center">
  <img src="https://raw.githubusercontent.com/prince-chrismc/user-management/master/docs/Screencast-2020-07-18-230754.gif">
</p>

## :microscope: Technical Overview

This repository contains a distributed cloud native application comprised of two compents:

* [Front-end](web-app/) - Primary point of interaction with users. It is a [React](https://reactjs.org/) client side application build using [webpack](https://webpack.js.org) for _fast_ surfing.
* [Back-end](backend/) - Centralized data store containing the information of all known users. Written in [C++](https://isocpp.org/) for flexibility and scalability it leverages many Open-Source technologies [listed here](backend/conan.lock).

## :rocket: Cloud Deployments

> :information_source: The goal for this project is to span multiple public :cloud: clouds all the while costing the least amount possible

| Component | Status | Link
| --- | --- | --- |
| Back-end | ![staging is offline][staging-offline] | [AWS ECS Fargate][be]
| Front-end | ![staging is online][staging-warning] | [Azure Container][fe]
| Unified (deprecated) | ![production is stable][prod-stable] | [AWS EC2][u] |

[staging-online]: https://img.shields.io/badge/Staging-online-blue
[staging-offline]: https://img.shields.io/badge/Staging-offline-red
[staging-warning]: https://img.shields.io/badge/Staging-TLS%20Warning-yellow
[prod-stable]: https://img.shields.io/badge/Production-stable-brightgreen

[be]: http://backend-b54ef0d-1b76226fd6250e07.elb.us-east-2.amazonaws.com:8080
[fe]: http://user-management-front-end.centralus.azurecontainer.io/
[u]: https://ec2-18-222-250-141.us-east-2.compute.amazonaws.com

## :man_scientist: Development Summary

| Component | Build | Coverage |
| --- | --- | --- |
| Back-end | [![C++ CI](https://github.com/prince-chrismc/user-management/workflows/C++%20CI/badge.svg)](https://github.com/prince-chrismc/user-management/actions?query=workflow%3A%22C%2B%2B+CI%22)| [![Coverage Status](https://coveralls.io/repos/github/prince-chrismc/user-management/badge.svg?branch=master)](https://coveralls.io/github/prince-chrismc/user-management?branch=master) |
| Front-end | [![Node.js CI](https://github.com/prince-chrismc/user-management/workflows/Node.js%20CI/badge.svg)](https://github.com/prince-chrismc/user-management/actions?query=workflow%3A%22Node.js+CI%22) | [![codecov](https://img.shields.io/codecov/c/github/prince-chrismc/user-management)](https://codecov.io/gh/prince-chrismc/user-management) |
