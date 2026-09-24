---
title: "Evading Userland API Hooking, Again: Novel Attacks and a Principled Defense Method"
year: 2024
authors: C. Assaiante, S. Nicchi, D. C. D'Elia, L. Querzoni
venue: "In Proceedings of the 21st Conference on Detection of Intrusions and Malware & Vulnerability Assessment ([DIMVA '24](https://dimva.org/dimva2024))"
rank: "CORE23 rank: C"
links:
  - label: Preprint
    href: /data/papers/dimva24.pdf
  - label: DOI
    href: https://link.springer.com/chapter/10.1007/978-3-031-64171-8_8
  - type: cite
    href: /data/bibtex/dimva24.bib
---

Monitoring how a program utilizes userland APIs is behind much dependability and security research. To intercept and study their invocations, the established practice targets the prologue of API implementations for inserting hooks.

This paper questions the validity of this design for security uses by examining completeness and correctness attacks to it. We first show how evasions that jump across the hook instrumentation are practical and can reach places much deeper than those we currently find in executables in the wild. Next, we propose and demonstrate TOCTTOU attacks that lead monitoring systems to observe false indicators for the argument values that a program uses for API calls.

To mitigate both threats, we design a static analysis to identify vantage points for effective hook placement in API code, supporting both reliable call recording and accurate argument extraction. We use this analysis to implement an open-source prototype API monitor, Toxotidae, that we evaluate against adversarial and benign executables for Windows.