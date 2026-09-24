---
title: Where Did My Variable Go? Poking Holes in Incomplete Debug Information
year: 2023
keywords:
  - debug information
  - compiler optimizations
  - debugging
  - completeness
venue_name: ASPLOS '23
venue_url: https://www.asplos-conference.org/asplos2023/
doi: https://dl.acm.org/doi/10.1145/3575693.3575720
pdf: /data/papers/asplos23-full.pdf
pdf_label: Extended
authors:
  - full_name: Cristian Assaiante
    display_name: C. Assaiante
  - full_name: Daniele Cono D'Elia
    display_name: D. C. D'Elia
  - full_name: Giuseppe Antonio Di Luna
    display_name: G. A. Di Luna
  - full_name: Leonardo Querzoni
    display_name: L. Querzoni
venue: "In Proceedings of the 28th ACM International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS '23)"
rank: "CORE26 rank: A*"
links:
  - label: Talk
    href: https://www.youtube.com/watch?v=5Y43purMfig&t=1s&ab_channel=ACMSIGARCH
  - type: cite
    href: /data/bibtex/asplos23.bib
---

The availability of debug information for optimized executables can largely ease crucial tasks such as crash analysis. Source-level debuggers use this information to display program state in terms of source code, allowing users to reason on it even when optimizations alter program structure extensively. A few recent endeavors have proposed effective methodologies for identifying incorrect instances of debug information, which can mislead users by presenting them with an inconsistent program state.

In this work, we identify and study a related important problem: the completeness of debug information. Unlike correctness issues for which an unoptimized executable can serve as reference, we find there is no analogous oracle to deem when the cause behind an unreported part of program state is an unavoidable effect of optimization or a compiler implementation defect. In this scenario, we argue that empirically derived conjectures on the expected availability of debug information can serve as an effective means to expose classes of these defects.

We propose three conjectures involving variable values and study how often synthetic programs compiled with different configurations of the popular gcc and LLVM compilers deviate from them. We then discuss techniques to pinpoint the optimizations behind such violations and minimize bug reports accordingly. Our experiments revealed, among others, 24 bugs already confirmed by the developers of the gcc-gdb and clang-lldb ecosystems.