# **App Name**: QueryCraft SQL

## Core Features:

- Table & Column Builder UI: Interactive UI to input table name and dynamically add/edit/remove columns (name, type, constraints), and sample values for INSERT queries.
- Query Type Selector: Query type selector for SELECT, INSERT, UPDATE, DELETE statements.
- SQL Query Generator: Real-time SQL query generation based on user inputs, with a copy button for easy use.
- SQL Error Detection & Fix Prompts: SQL Error Detection tool to identify errors like missing tables and provide CREATE TABLE prompts as possible solutions. The LLM uses reasoning to incorporate database schema and error details.
- LocalStorage Integration: Local Storage Integration to save generated queries in the browser, allow editing and deleting saved queries, and show a saved query list.
- Export Feature: Export feature to download all saved queries as a .sql file using the Blob API with filename format: query_backup_YYYY-MM-DD.sql.
- UI/UX Enhancements: Intuitive UI/UX including optional auto-fill for example data and tooltip help for each SQL type.

## Style Guidelines:

- Primary color: Soft blue (#77B5FE) to represent reliability and clarity.
- Background color: Light grey (#F5F7FA) for a clean, focused workspace.
- Accent color: Vibrant green (#2ECC71) for CTAs, signifying action and correctness.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a modern, neutral look suitable for both headlines and body text.
- Code font: 'Source Code Pro' for displaying SQL code snippets.
- Simple, clear icons to represent different SQL operations and data types.
- Clean, well-organized layout with a focus on usability and intuitive placement of controls.