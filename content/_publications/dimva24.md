---
title: "Evading Userland API Hooking, Again: Novel Attacks and a Principled Defense Method"
year: 2024
keywords:
  - api hooking
  - malware analysis
  - program analysis
  - binary instrumentation
venue_name: DIMVA '24
venue_url: https://dimva.org/dimva2024
doi: https://link.springer.com/chapter/10.1007/978-3-031-64171-8_8
doi_id: 10.1007/978-3-031-64171-8_8
publisher: Springer Nature Switzerland
pdf: /data/papers/dimva24.pdf
pdf_label: Preprint
authors:
  - full_name: Cristian Assaiante
    display_name: C. Assaiante
  - full_name: Simone Nicchi
    display_name: S. Nicchi
  - full_name: Daniele Cono D'Elia
    display_name: D. C. D'Elia
  - full_name: Leonardo Querzoni
    display_name: L. Querzoni
venue: "In Proceedings of the 21st Conference on Detection of Intrusions and Malware & Vulnerability Assessment (DIMVA '24)"
rank: "CORE26 rank: B"
links:
  - type: cite
    href: /data/bibtex/dimva24.bib
---

Monitoring how a program utilizes userland APIs is behind much dependability and security research. To intercept and study their invocations, the established practice targets the prologue of API implementations for inserting hooks.

This paper questions the validity of this design for security uses by examining completeness and correctness attacks to it. We first show how evasions that jump across the hook instrumentation are practical and can reach places much deeper than those we currently find in executables in the wild. Next, we propose and demonstrate TOCTTOU attacks that lead monitoring systems to observe false indicators for the argument values that a program uses for API calls.

To mitigate both threats, we design a static analysis to identify vantage points for effective hook placement in API code, supporting both reliable call recording and accurate argument extraction. We use this analysis to implement an open-source prototype API monitor, Toxotidae, that we evaluate against adversarial and benign executables for Windows.