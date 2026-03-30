export const legalPageOrder = [
  "terms",
  "privacy-safety",
  "cookies",
  "account-contact-info",
  "community-guidelines",
  "reporting-safety",
  "copyright-trademark",
  "ip-takedown",
  "uk-complaints",
  "japan-platform-act",
  "australia-online-safety",
  "contact",
];

export const legalPages = {
  terms: {
    href: "/terms-conditions",
    title: "Terms & Conditions",
    eyebrow: "PHLEXR Terms",
    intro:
      "These Terms govern access to PHLEXR, including accounts, posting, comments, follows, notifications, boosts, memberships, and share tools. By creating an account or using the service, you agree to use PHLEXR responsibly and only for lawful, platform-safe purposes.",
    sections: [
      {
        heading: "Using PHLEXR",
        body: [
          "PHLEXR is a social platform for posting and discussing status, style, purchases, travel, collections, and other lifestyle flexes. You may browse public content without every feature enabled, but posting, commenting, following, voting, and managing memberships require an account.",
          "You must provide accurate account information, keep your credentials secure, and use an email address or mobile number that you control. You are responsible for activity that happens through your account unless you report unauthorized access promptly.",
        ],
      },
      {
        heading: "Content, posting, and conduct",
        body: [
          "You keep ownership of the photos, videos, captions, comments, profile text, and other content you post. By uploading content to PHLEXR, you give us a limited license to host, process, display, distribute, and moderate that content so the service can function.",
          "You may not use PHLEXR to post unlawful material, scams, impersonation, non-consensual intimate content, deceptive edits, malware, or material that infringes another person’s rights. We may limit, label, remove, or reduce distribution of content that violates our policies or creates safety risk.",
        ],
      },
      {
        heading: "Voting, moderation, and platform decisions",
        body: [
          "PHLEXR includes community signals such as ratings, trust cues, and fake or AI voting. Those tools are part of the product experience and may affect how content is ranked, labeled, or reviewed.",
          "We may investigate reports, review content, suspend features, revoke memberships, or disable accounts when necessary to protect users, comply with law, or preserve platform integrity. Platform safety decisions may be automated, human-reviewed, or both.",
        ],
      },
      {
        heading: "Memberships, boosts, and paid features",
        body: [
          "Paid memberships and boosts unlock additional status, pricing, and promotional features. Specific feature descriptions, billing terms, and availability may change as PHLEXR evolves.",
          "If PHLEXR offers paid products in your region, you agree to pay the displayed price, applicable taxes, and any recurring charges tied to your plan. We may pause or remove paid features if misuse, fraud, chargebacks, or policy violations occur.",
        ],
      },
      {
        heading: "Ending access",
        body: [
          "You may stop using PHLEXR at any time. We may restrict or terminate access if you violate these Terms, create legal or safety risk, or misuse PHLEXR features.",
          "Some content, logs, payment records, abuse reports, and safety records may be retained after account closure where needed for security, dispute resolution, legal compliance, or fraud prevention.",
        ],
      },
    ],
  },
  "privacy-safety": {
    href: "/privacy-safety-policy",
    title: "Privacy / Safety Policy",
    eyebrow: "PHLEXR Privacy & Safety",
    intro:
      "This page explains what information PHLEXR handles, how we use it, and how we approach trust, moderation, and user safety across posting, comments, follows, notifications, boosts, and reporting features.",
    sections: [
      {
        heading: "Information PHLEXR collects",
        body: [
          "We collect account details such as your email address, username, password credentials handled by our authentication providers, profile information, device and browser information, IP-based security signals, and records of how you use PHLEXR.",
          "When you post, comment, follow, share, report, or purchase memberships or boosts, we create service records so those features can work, be moderated, and be improved over time.",
        ],
      },
      {
        heading: "How PHLEXR uses information",
        body: [
          "We use account and activity information to operate the app, personalize your feed, send service notifications, detect abuse, support sign-in and recovery, and maintain platform safety.",
          "We also use signals tied to votes, reports, and moderation outcomes to investigate fake or misleading content, reduce manipulation, and protect the trust model behind PHLEXR scoring.",
        ],
      },
      {
        heading: "Safety and moderation",
        body: [
          "PHLEXR combines product rules, automated signals, and manual review to detect harmful behavior, scams, repeat abuse, and unsafe content. Reports may be reviewed by internal staff, trusted vendors, or legal partners where necessary.",
          "We may preserve evidence linked to reports, including post content, comment logs, device and session details, and prior moderation history, so we can respond responsibly to safety issues.",
        ],
      },
      {
        heading: "Sharing and disclosure",
        body: [
          "Public content on PHLEXR can be viewed, shared, copied by link, and surfaced through in-app share tools. Private account data is not public by default, but profile information, usernames, badges, posts, and comments may be visible depending on the feature context.",
          "We may disclose data when required by law, to protect people from harm, to enforce our policies, or during fraud, security, intellectual property, and payment investigations.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "You can update your profile, control what you post, remove comments or posts you own, and request account recovery or closure through PHLEXR support channels.",
          "Some records must still be retained for security, billing, fraud prevention, legal obligations, or abuse handling even after content is removed from the visible service.",
        ],
      },
    ],
  },
  cookies: {
    href: "/cookies-policy",
    title: "Cookies Policy",
    eyebrow: "PHLEXR Cookies",
    intro:
      "PHLEXR uses cookies and similar storage tools to keep users signed in, secure account sessions, remember preferences, and measure how core features perform across devices.",
    sections: [
      {
        heading: "Essential cookies",
        body: [
          "Essential cookies and local storage keep account sessions active, support sign-in and recovery, maintain security tokens, and help the app remember things like your current session, notifications state, and basic product preferences.",
          "Without these tools, PHLEXR cannot reliably provide core account and posting features.",
        ],
      },
      {
        heading: "Performance and product improvement",
        body: [
          "We may use analytics and product diagnostics to understand feed performance, posting reliability, moderation flows, safety interactions, and whether membership or sharing features are working as intended.",
          "These measurements help us improve stability, reduce abuse, and make the app faster and more trustworthy.",
        ],
      },
      {
        heading: "Your browser controls",
        body: [
          "Most browsers let you block or clear cookies and site storage. Doing so may sign you out, interrupt account recovery, or prevent parts of PHLEXR from working properly.",
          "If you clear storage while using sign-in or password-reset flows, you may need to request a new login or reset link.",
        ],
      },
    ],
  },
  "account-contact-info": {
    href: "/account-contact-info",
    title: "How PHLEXR Uses the Email Address or Mobile Phone Number on Your Account",
    eyebrow: "PHLEXR Account Contact Info",
    intro:
      "PHLEXR uses account contact details to create and secure accounts, send service messages, support sign-in and recovery, and communicate important product or safety updates.",
    sections: [
      {
        heading: "Why we collect contact details",
        body: [
          "Your email address is used to create your account, confirm ownership, support password resets, notify you about sign-in issues, and send important service updates.",
          "If PHLEXR enables phone-based account options in certain regions, a mobile phone number may be used for account verification, recovery, fraud prevention, and serious service or safety alerts.",
        ],
      },
      {
        heading: "What PHLEXR sends",
        body: [
          "We may send account confirmations, password-reset messages, critical security alerts, billing notices, moderation notices, legal notices, and service-related notifications.",
          "We may also send optional product updates, but you can opt out of non-essential promotional communications when those become available.",
        ],
      },
      {
        heading: "How PHLEXR protects contact details",
        body: [
          "Contact details are treated as account data and are not displayed publicly as part of your public PHLEXR profile unless you intentionally add them elsewhere.",
          "We may share contact information with service providers that help us run authentication, messaging, billing, fraud prevention, or legal compliance, but only for those purposes.",
        ],
      },
    ],
  },
  "community-guidelines": {
    href: "/community-guidelines",
    title: "Community Guidelines / Acceptable Use",
    eyebrow: "PHLEXR Community Rules",
    intro:
      "PHLEXR is designed for status-driven social posting, but trust and safety matter as much as flex culture. These guidelines explain what belongs on the platform and what we will remove, limit, or escalate.",
    sections: [
      {
        heading: "What belongs on PHLEXR",
        body: [
          "Original flex content, commentary, reactions, and profile identity that are lawful, authentic, and safe for a broader social audience belong on PHLEXR.",
          "Users can debate quality, vote on credibility, and call out fake or AI-looking flexes, but those interactions must stay within our platform conduct rules.",
        ],
      },
      {
        heading: "What is not allowed",
        body: [
          "No threats, extortion, doxxing, hate speech, harassment, impersonation, scams, theft, sale of illegal goods, sexual exploitation, non-consensual intimate imagery, or graphic violence.",
          "Do not use PHLEXR to manipulate ratings, coordinate abuse, mislead users with fraudulent luxury claims, or evade moderation through throwaway accounts.",
        ],
      },
      {
        heading: "Authenticity and manipulated content",
        body: [
          "PHLEXR recognizes that editing, staging, and satire are part of internet culture, but deceptive impersonation, fabricated ownership claims, and manipulated media used to defraud or harass are not allowed.",
          "Fake or AI voting is part of the product, but votes or reports must not be used as a weaponized harassment tool.",
        ],
      },
    ],
  },
  "reporting-safety": {
    href: "/reporting-abuse-safety",
    title: "Reporting / Abuse / Safety",
    eyebrow: "PHLEXR Safety Help",
    intro:
      "If something on PHLEXR feels unsafe, deceptive, abusive, or unlawful, use this page as your starting point. PHLEXR supports content reporting, account reporting, and safety escalation.",
    sections: [
      {
        heading: "What you can report",
        body: [
          "You can report posts, comments, impersonation, scams, private-information leaks, harassment, predatory conduct, fraud, fake or manipulated content, and copyright or trademark concerns.",
          "You can also contact PHLEXR if a person is using the service to target you off-platform or to coordinate threats or extortion.",
        ],
      },
      {
        heading: "What happens after a report",
        body: [
          "PHLEXR may review the content, related comments, account history, prior reports, session details, and moderation signals before deciding whether to remove content, reduce visibility, warn the user, or suspend access.",
          "Some urgent issues, including threats of violence, child safety issues, and non-consensual intimate imagery, may be escalated immediately and preserved for legal or law-enforcement cooperation where required.",
        ],
      },
      {
        heading: "How to contact PHLEXR",
        body: [
          "For general abuse or platform safety concerns, contact safety@phlexr.com. For urgent legal or law-enforcement requests, use legal@phlexr.com. For product support, use support@phlexr.com.",
          "Include links, screenshots, usernames, and a short explanation of the issue so the team can review quickly.",
        ],
      },
    ],
  },
  "copyright-trademark": {
    href: "/copyright-trademark-policy",
    title: "Copyright / Trademark Policy",
    eyebrow: "PHLEXR IP Policy",
    intro:
      "PHLEXR respects intellectual property rights. Users must only upload and share content they have the right to post, and rights holders can contact us about copyright or trademark concerns.",
    sections: [
      {
        heading: "User responsibilities",
        body: [
          "Do not post photos, videos, logos, designs, music, or other protected material unless you own the rights or have permission to use it in the way you are using it on PHLEXR.",
          "Do not use another person’s brand, likeness, or business identity in a way that falsely suggests endorsement, affiliation, or origin.",
        ],
      },
      {
        heading: "Trademark misuse",
        body: [
          "PHLEXR may act on reports involving counterfeit listings, misleading luxury branding, false badge claims, or branding that creates confusion about source or sponsorship.",
          "We may remove or limit content while reviewing a complaint, especially where consumer deception or repeat abuse is involved.",
        ],
      },
      {
        heading: "Submitting a complaint",
        body: [
          "Send intellectual property complaints to ip@phlexr.com or legal@phlexr.com with enough information for PHLEXR to identify the content, the rights you claim, and why you believe the material should be removed or restricted.",
          "False or abusive complaints may be rejected and can lead to reduced complaint priority or further action where misuse is repeated.",
        ],
      },
    ],
  },
  "ip-takedown": {
    href: "/ip-takedown-policy",
    title: "DMCA / IP Takedown Process",
    eyebrow: "PHLEXR Takedowns",
    intro:
      "This page explains how PHLEXR handles takedown requests, counter-notices, and trademark or copyright complaints tied to user-generated content on the platform.",
    sections: [
      {
        heading: "What to include in a takedown request",
        body: [
          "Provide your name, organization if relevant, contact details, the content location, a description of the work or brand at issue, and a good-faith explanation of why the PHLEXR content infringes your rights.",
          "PHLEXR may request additional evidence before acting, especially for claims involving resale, parody, comparative commentary, or unclear ownership.",
        ],
      },
      {
        heading: "Counter-notices and disputes",
        body: [
          "If PHLEXR removes or limits content after an IP complaint, the affected user may be allowed to respond with additional rights information or a counter-statement where local law permits.",
          "PHLEXR may restore content if the complaint appears mistaken, abusive, incomplete, or legally unsupported, or if the parties resolve the dispute.",
        ],
      },
      {
        heading: "Where to send notices",
        body: [
          "Send IP complaints to ip@phlexr.com and legal@phlexr.com. Use the subject line 'PHLEXR IP Notice' so the request routes correctly.",
          "PHLEXR may retain complaint records, related content, and relevant account data while a dispute is under review.",
        ],
      },
    ],
  },
  "uk-complaints": {
    href: "/uk-complaints",
    title: "UK Complaints",
    eyebrow: "PHLEXR UK Notice",
    intro:
      "This page explains how users in the United Kingdom can contact PHLEXR about platform complaints, moderation actions, and safety-related concerns.",
    sections: [
      {
        heading: "What UK users can raise",
        body: [
          "UK users may contact PHLEXR about content restrictions, account actions, user safety concerns, moderation outcomes, scams, intellectual property complaints, and concerns about PHLEXR’s handling of harmful or unlawful material.",
          "Where required, PHLEXR will review complaints in line with applicable UK platform, consumer, and online-safety expectations.",
        ],
      },
      {
        heading: "How to submit a complaint",
        body: [
          "Email complaints@phlexr.com with your PHLEXR username, the affected content or account, the date of the issue, and a clear description of the problem.",
          "If the issue involves imminent harm, threats, or illegal content, also email safety@phlexr.com and include any supporting evidence.",
        ],
      },
    ],
  },
  "japan-platform-act": {
    href: "/japan-distribution-platform-act",
    title: "Japan Distribution Platform Act Notice",
    eyebrow: "PHLEXR Japan Notice",
    intro:
      "This notice is provided for transparency regarding PHLEXR’s handling of user-generated content, complaints, and moderation processes for users and regulators interested in Japan platform-distribution disclosures.",
    sections: [
      {
        heading: "Platform handling",
        body: [
          "PHLEXR hosts user posts, comments, profiles, follows, notifications, and share tools. We may rank, reduce, label, review, or remove content based on platform rules, safety risk, authenticity signals, and legal obligations.",
          "Moderation decisions may be informed by reports, safety tooling, account history, fake or AI voting patterns, and human review.",
        ],
      },
      {
        heading: "Complaints and contact",
        body: [
          "Questions related to content distribution, moderation, or legal notices in Japan can be directed to legal@phlexr.com with 'Japan Platform Inquiry' in the subject line.",
          "PHLEXR may request additional information so we can identify the relevant content, account, or regulatory issue.",
        ],
      },
    ],
  },
  "australia-online-safety": {
    href: "/australia-online-safety",
    title: "Australia Online Safety Act Notice",
    eyebrow: "PHLEXR Australia Notice",
    intro:
      "This notice explains PHLEXR’s approach to harmful content, complaints, and safety escalation in the context of Australian online-safety expectations.",
    sections: [
      {
        heading: "Safety commitments",
        body: [
          "PHLEXR works to detect and address scams, harassment, image-based abuse, coordinated harm, impersonation, and unlawful content through reporting tools, moderation, and account controls.",
          "Where Australian law or regulator guidance requires action, PHLEXR may preserve records, restrict visibility, remove content, or cooperate with lawful requests.",
        ],
      },
      {
        heading: "Reporting in Australia",
        body: [
          "Users in Australia can report harmful content to safety@phlexr.com and complaints@phlexr.com. Include relevant links, screenshots, usernames, and why the content is harmful or unlawful.",
          "Urgent threats, child safety issues, and serious image-based abuse should be reported immediately with as much supporting detail as possible.",
        ],
      },
    ],
  },
  contact: {
    href: "/contact-support",
    title: "Contact / Support / Legal Contact",
    eyebrow: "PHLEXR Contact",
    intro:
      "PHLEXR offers separate contact channels for product support, legal notices, safety escalations, and intellectual property complaints so requests can reach the right team faster.",
    sections: [
      {
        heading: "Support channels",
        body: [
          "General support: support@phlexr.com",
          "Safety and abuse: safety@phlexr.com",
          "Legal notices and regulatory contact: legal@phlexr.com",
          "Copyright, trademark, and takedowns: ip@phlexr.com",
          "Formal complaints: complaints@phlexr.com",
        ],
      },
      {
        heading: "What to include",
        body: [
          "Please include your PHLEXR username, the relevant link or content reference, the issue you are reporting, and any screenshots or supporting detail that will help us investigate quickly.",
          "PHLEXR may request identity confirmation or additional information before sharing account-specific information or acting on legal requests.",
        ],
      },
    ],
  },
};

export function getLegalPage(slug) {
  return legalPages[slug];
}
