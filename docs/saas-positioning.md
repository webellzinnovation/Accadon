# Accadon: current product direction

Updated 2026-10-15 after the owner corrected the coaching-service interpretation. This document overrides the archived `product-spec.txt` where it differs.

## Audience and business model

Accadon is software for multi-sport academies and sports clubs. It is not Nishchithh's table tennis coaching-service website. His coaching background is founder context only, not a customer claim or proof of results.

- Free tournament pages are the entry point. The intended product promise is tournaments free forever, with each public page introducing the coaching platform.
- Academy-branded tournament page, registration, draws/brackets and live scoring are planned. No tournament functionality exists in this branch yet.
- Coaching management is a paid subscription: batches/session allocation, players/parents, attendance, configurable course-based assessment and fees.
- Each academy connects its own gateway; academy fees go to that academy. No payment or gateway flow is implemented yet. Provider processing terms and any fees still need verification when integrated.
- Platform super admin manages multiple academies. Each academy's admin has control of its own workspace. Every private record must be tenant-scoped before private APIs are opened.
- Courses, levels/lessons, assessments and match journals remain product requirements. Rubrics are configurable, not invented defaults. Exact course hierarchy should be reconciled with the owner's full SaaS spec before implementing it.
- Android/iOS apps are a later requirement. No delivery dates or store availability are promised.

## This branch

Public product story and SaaS inquiry collection only. Planned features are described with an explicit in-development notice. CTA links open the inquiry form, not a fake signup or tournament builder. No prices, academy counts, logos, testimonials, performance claims or user records are invented.

Inquiry asks for contact name/mobile, academy or club name, sport(s), city, role, software interest (free tournament pages / coaching / both), optional email/message and consent. API security/transaction/retry behavior is unchanged. New migration 002 preserves old rows and adds sport/role; `locality` stores city and `institution` stores academy name for schema continuity. Those internal legacy names can be renamed in a future migration if needed.

## Not implemented

Tournament system, academy claiming, multi-tenancy, login/roles, coaching subscriptions, own-gateway settlement, parent portal, assessments, match journal and native apps. These are roadmap requirements, not working features. Production launch still requires privacy approval and operational configuration.
