---
title: Authoring Guide
description: How slop-learn is organized and how to add AI-generated learning material.
sidebar:
  order: 0
---

slop-learn hosts AI-generated personal learning material as a set of **courses**.
This guide explains the conventions so a new course slots in cleanly.

## The model

- **A course is a folder** under `src/content/docs/`. The folder name is the URL slug.
- **A page is a markdown file** (`.md` or `.mdx`) inside that folder, with YAML
  frontmatter providing at least a `title` and `description`.
- **Navigation is driven by `src/config/sidebar.json`**, which lists each course
  as a group. Within a group, pages are ordered by their `sidebar.order` frontmatter.

The [Example Course](/example-course/overview/) is a living template — copy it to
bootstrap something new.

## Where to go next

- [Add a Course](/authoring/add-a-course/) — create a folder, write frontmatter,
  and register the course in the sidebar.
- [Frontmatter Reference](/authoring/frontmatter-reference/) — the fields you can
  set on each page and what they do.
