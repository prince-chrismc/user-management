# User Management [![Docs](https://img.shields.io/badge/API%20Documentation-main-blue)](https://prince-chrismc.github.io/user-management/)

An open-source application delivering a responsive user management experience.

<p align="center">
  <img src="https://raw.githubusercontent.com/prince-chrismc/user-management/main/docs/Screencast-2020-07-18-230754.gif">
</p>

## :microscope: Technical Overview

This repository contains a distributed cloud native application comprised of two components:

* [Front-end](frontend/) - Primary point of interaction with users. It is a [React](https://reactjs.org/) client side application build using [webpack](https://webpack.js.org) for _fast_ surfing.
* [Back-end](backend/) - Centralized in-memory data storage containing the information of all known users. Written in [C++](https://isocpp.org/) for flexibility and scalability it leverages many Open-Source technologies [listed here](backend/conan.lock).

## :rocket: Cloud Deployments

> :information_source: The goal for this project is to span multiple public :cloud: clouds all the while costing the least amount possible

:no_entry_sign: Currently offline!

## :man_scientist: Development Summary

| Component | Build | Coverage |
| --- | --- | --- |
| Back-end | [![C++ CI](https://github.com/prince-chrismc/user-management/workflows/C++%20CI/badge.svg)](https://github.com/prince-chrismc/user-management/actions?query=workflow%3A%22C%2B%2B+CI%22)| [![Coverage Status](https://coveralls.io/repos/github/prince-chrismc/user-management/badge.svg?branch=main)](https://coveralls.io/github/prince-chrismc/user-management?branch=main) |
| Front-end | [![Node.js CI](https://github.com/prince-chrismc/user-management/workflows/Node.js%20CI/badge.svg)](https://github.com/prince-chrismc/user-management/actions?query=workflow%3A%22Node.js+CI%22) | [![codecov](https://img.shields.io/codecov/c/github/prince-chrismc/user-management)](https://codecov.io/gh/prince-chrismc/user-management) |
