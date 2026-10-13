# Website privacy, accessibility and legal review

Reviewed 13 October 2026. This is an implementation checklist, not legal advice or a compliance certification.

## Implemented in the website

- Privacy, terms, cookie and refund/cancellation information pages linked from site footers.
- Removed the homepage patient-review excerpts and their ratings.
- Appointment enquiry asks name, email, optional phone and a query, requires an acknowledgement, and opens a mail draft rather than posting to the web server. The notice warns users not to include health information.
- Disclosed the AI chat flow to Google Gemini and advised visitors not to enter personal or health information.
- Consent choice for optional Maps/video embeds; choice is stored in local storage. Declined state leaves a direct provider link.
- Removed Google Fonts external requests; local system font fallbacks are used.
- Published contact information and standardized the Jalandhar address postal code to 144005 based on the site's structured business data. Confirm against official clinic records.
- Existing content has image alt text for meaningful static images; decorative dynamically generated images use empty alt text. Not every image's source/license could be verified from project files.

## Clinic/operator must confirm before public launch

1. **Controller identity:** Confirm the exact legal name of the operator, legal form, full postal address, privacy contact, and any grievance/contact officer details required under laws that apply.
2. **Jurisdictions and privacy law:** This site is operated in India. Confirm whether it is offered to people in the EU/UK, California, or other privacy jurisdictions. India’s Digital Personal Data Protection Act, 2023 and implementing rules/commencement are subject to current effective dates and scope; obtain current local counsel advice before launch. Add any required notices, rights, consent/withdrawal, retention and complaint process.
3. **Data inventory and retention:** Confirm hosting provider, server access logs, their fields/retention, email handling, Gemini terms/retention, Meta API data, backups, access controls, and how deletion/access requests are fulfilled. Policies must match the deployed hosting configuration.
4. **Cookies and consent:** The code scan found no analytics or advertising tags. It cannot inspect browser/server headers or all runtime network calls. Test production in a clean browser and verify that no optional provider resource or identifier loads before choice. Whether prior cookie consent is legally required depends on visitor location and actual storage/tracking. The current banner addresses Maps/videos only; static social links and any social-feed server calls need runtime review. If feeds make Meta calls before a choice or third parties set non-essential cookies, gate them too.
5. **Refunds and bookings:** The site does not transact. The clinic must publish its real cancellation, rescheduling, deposit and refund rules before accepting any booking or payment online or relying on this policy.
6. **Medical advertising:** Review every treatment statement, credential, outcome depiction, before/after image and AI response against applicable Indian medical advertising/professional rules. Do not make unsupported efficacy, safety, superiority or guaranteed-result claims. Obtain documented patient permissions for any identifiable patient content.
7. **Copyright and image permissions:** Verify license/ownership and required attribution for every photograph, social preview, video, icon, logo, and externally hosted image. Pexels image URLs previously used on the home carousel were replaced with local paths but those files are not present; restore only properly licensed supplied assets or remove those backgrounds.
8. **Accessibility:** Keyboard support and focus indicators exist in several components, and the enquiry form labels each field. Complete a full WCAG 2.2 AA review with keyboard-only, screen-reader, zoom/reflow and automated contrast checks; gradients, small text and interactive carousel/gallery states need visual/runtime testing. Provide captions/transcripts for clinic videos where required.
9. **Security/operations:** Confirm HTTPS, CSP and other security headers, dependency updates, contact-form abuse controls if the form ever becomes server-submitted, and a process for privacy/security incidents.

## Cookie / consent assessment

No analytics or advertising tracker was found in the static files reviewed. A cookie banner is not automatically required solely because a site has cookies: local rules turn on actual storage/access technologies, purposes, and visitor location. Third-party Maps, Facebook/Instagram and video embeds may create provider connections or storage. The implementation therefore offers allow/decline choices before Maps and Facebook video loads, but production network verification and jurisdiction-specific legal review remain necessary. Google Maps is deliberately opt-in; fonts now use system fallbacks.
