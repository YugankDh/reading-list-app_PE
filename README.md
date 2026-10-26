# Student Reading List Application (Assignment 11)

## Overview
A responsive client-side Reading List web application built with vanilla HTML5, CSS3, and JavaScript following vibe-coding and iterative defect-fixing methodology.

## Implemented Prompts & Features

1. **Main App Requirements**:
   - Add books with title and reading status (`Want to Read`, `Reading`, `Finished`).
   - Dynamic status transitions between statuses.
   - Status filtering dropdown.
   - Empty list message: `"Your reading list is empty. Add your first book."`
   - Zero external backend/database dependency; state persisted in `localStorage`.

2. **Defect-Fixing Prompt**:
   - **Case-insensitive & whitespace duplicate prevention**: Displays `"This book is already in your reading list."`
   - **60-character length restriction**: Displays `"Book title must be 60 characters or fewer."`

3. **Additional-Features Prompt**:
   - Individual **Delete button** on each book card.
   - **Live summary metric counters**: Total Books, Currently Reading, and Finished counts.

## Tech Stack
- HTML5 (Semantic Structure)
- CSS3 (Responsive Grid/Flexbox Layout)
- Vanilla JavaScript (Local storage & DOM manipulation)
