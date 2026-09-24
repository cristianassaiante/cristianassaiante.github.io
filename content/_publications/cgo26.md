---
title: Towards Threading the Needle of Debuggable Optimized Binaries
year: 2026
keywords:
  - debug information
  - compiler optimizations
  - debugging
  - profile-guided optimization
venue_name: CGO '26
venue_url: https://2026.cgo.org/
doi: https://ieeexplore.ieee.org/document/11395216
pdf: /data/papers/cgo26.pdf
pdf_label: Preprint
authors:
  - full_name: Cristian Assaiante
    display_name: C. Assaiante
  - full_name: Simone Di Biasio
    display_name: S. Di Biasio
  - full_name: Snehasish Kumar
    display_name: S. Kumar
  - full_name: Giuseppe Antonio Di Luna
    display_name: G. A. Di Luna
  - full_name: Daniele Cono D'Elia
    display_name: D. C. D'Elia
  - full_name: Leonardo Querzoni
    display_name: L. Querzoni
venue: "In Proceedings of the 24th ACM/IEEE International Symposium on Code Generation and Optimization (CGO '26)"
rank: "CORE26 rank: A"
links:
  - label: Artifact
    href: https://zenodo.org/records/17865056
  - type: cite
    href: /data/bibtex/cgo26.bib
---

Compiler optimizations may lead to loss of debug information, hampering developer productivity and techniques that rely on binary-to-source mappings, such as sampling-based feedback-directed optimization. While recent endeavors exposed debug information correctness and completeness bugs in compiler transformations, understanding where a complex optimizing pipeline loses debug information is an understudied problem.

In this paper, we first rectify accuracy issues in methods for measuring the availability of debug information, and show that the synthetic programs evaluated so far lead to metric values that differ from those we observe for real-world programs. Building on this, we present DebugTuner, a framework for systematically analyzing the impact of individual compiler optimization passes on debug information, and assemble a test suite of programs for collecting more realistic metrics. Using DebugTuner and the test suite, we identify transformations in gcc and clang that cause more debug information loss, and construct modified optimization levels that improve debuggability while retaining competitive performance. We obtain levels that outperform gcc's Og for both debuggability and performance, and make recommendations for constructing an Og level for clang. Finally, we present a case study on AutoFDO where, by disabling selected passes in the profiling stage, the final optimized binary is more performant due to the improved quality of the binary-to-source mapping.