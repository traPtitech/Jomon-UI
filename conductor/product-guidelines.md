# Product Guidelines

These guidelines define the design, user experience, and quality standards for the Jomon UI project. They serve to ensure consistency and usability across the application.

## Design & User Experience (UX)
- **Tone & Style:**
    - **Clean & Minimalist:** The interface should prioritize content and functionality, avoiding unnecessary clutter to reduce cognitive load. The aesthetic should be modern and professional.

- **Interaction Principles:**
    - **Efficiency:** Optimize workflows to minimize the number of clicks required for high-frequency tasks such as submitting applications and approving requests.
    - **Clarity:** Provide immediate and unambiguous feedback. Status indicators (e.g., Pending, Approved, Rejected) must be distinct, and error messages should be clear and actionable.
    - **Accessibility:** (Implied) Strive for an inclusive experience adhering to standard accessibility practices.

- **Visual Identity:**
    - **Branding:** Incorporate the Digital Creation Club traP's official color palette and logo to maintain brand consistency.
    - **Design System:** Leverage established design principles (e.g., Material Design concepts) as a foundation but adapt them to create a custom, modern aesthetic with consistent spacing, typography, and component styling.

## Content Strategy
- **Labeling:** Use concise, active, and predictable labels for interactive elements (buttons, links). Avoid jargon where possible.
- **Localization:** The interface will primarily support **Japanese** only.

## Code Quality & Engineering Standards
- **Type Safety:** Enforce strict TypeScript usage to minimize runtime errors. 
    - **Avoid `any`:** Do not use `any` types.
    - **Avoid Type Assertions:** Minimize the use of `as` type assertions. Prefer type guards or proper typing to ensure safety.
    - **Definitions:** Ensure comprehensive type definitions for all entities and API responses.
- **Modularity:** Build components with reusability in mind. Follow a feature-based architecture where components are grouped by domain but maintain low coupling.
- **Testing:** Maintain high test coverage, particularly for critical business logic and utility functions, to safeguard against regressions during refactoring.