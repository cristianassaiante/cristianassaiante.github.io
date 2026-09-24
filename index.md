---
layout: default
title: Cristian Assaiante
---

{% capture profile %}{% include content/profile.md %}{% endcapture %}
{{ profile | markdownify }}

{% include sections/about.html %}

{% include sections/publications.html %}

{% include sections/projects.html %}