# Founders Hub documents

Source files for the Founders Hub library on the AIBN website.
Upload them in the admin console at `/admin/toolkits`, choosing the matching
category and framework. Once a file is uploaded, remove its matching entry from
`app/lib/toolkit-content.ts` so the card is not listed twice.

## IMPORTANT: partner review required before publishing

These were drafted from official Irish sources (Revenue, gov.ie, DSP, CRO) and
then independently fact-checked, figure by figure, against those same sources.
Errors found in that check have been corrected. They have **not** been reviewed
by a person, and they carry the firm's name, so a partner must read and sign off
each one before it goes to a client.

Everything below is stated for the **2026 Irish tax year** (Budget 2026). Rates
and thresholds move at each Budget: re-check before reissuing.

## Memos (4)

### Salary vs dividends: director remuneration memo

- **File:** `Memos/Salary vs dividends - director remuneration memo.pdf`
- **Category:** Memos · **Format:** PDF
- **Fact-check:** 62 figures verified, 1 critical and 1 major issues found and corrected
- **Corrected critical errors** (confirm these read correctly):
  - Class S PRSI benefit coverage — Jobseeker's Benefit
- **Open points for the reviewing partner:**
  - Correction to a figure held in the firm's codebase. The codebase records PRSI as 4.1% in 2025 and 4.2% from the start of 2026. The rate actually rose to 4.2% on 1 October 2025, so 4.1% applied only to 30 September 2025 and 4.2% applied for 
  - Refinement to the pension figure held in the codebase. Recording pension relief as age-banded 15% to 40% on earnings capped at EUR 115,000 is correct for contributions the individual makes from their own income, but it must not be read as a
  - Refinement to the credits figure held in the codebase. A proprietary director, meaning one owning or controlling more than 15% of ordinary share capital, is not entitled to the Employee (PAYE) Tax Credit at all. They claim the Earned Income
  - The worked illustration charges PRSI at 4.2% on the dividend. Two things need checking on the actual facts. First, whether the director's dividend income is reckonable for Class S in their circumstances, particularly if they are over 66. Se
  - Where a director's non-PAYE income exceeds EUR 100,000, dividend income carries the 3% USC surcharge, so the excess bears USC at 11% rather than 8%. That widens the gap between salary and dividends beyond the illustration used here, so mode
  - gov.ie and citizensinformation.ie both return HTTP 403 to automated retrieval, so the PRSI rates, the 50% director shareholding test, the State Pension rate and the contribution counts were taken from search-indexed extracts of those offici

### Preliminary tax and filing deadlines memo

- **File:** `Memos/Preliminary tax and filing deadlines memo.pdf`
- **Category:** Memos · **Format:** PDF
- **Fact-check:** 48 figures verified, 2 critical and 1 major issues found and corrected
- **Corrected critical errors** (confirm these read correctly):
  - Late filing surcharge base for directors (PAYE credit)
  - Large company preliminary CT, accounting period under seven months
- **Open points for the reviewing partner:**
  - DISAGREEMENT WITH THE BRIEF, CGT payment date. The brief states 1 December for January to November disposals. Revenue states 15 December. For disposals between 1 January and 30 November the tax is due by 15 December of that same year, confi
  - DISAGREEMENT WITH THE FIRM'S HELD FIGURES, PRSI. The firm's note says 4.1% in 2025 and 4.2% from the start of 2026. In fact the increase to 4.2% took effect on 1 October 2025, so 2025 was split between 4.1% and 4.2%. In 2026 the rate is 4.2
  - POSSIBLY STALE REVENUE PAGE, R&D credit. The Revenue Budget 2026 Summary (published 7 October 2025) confirms the increase from 30% to 35%. However, Revenue's own R&D tax credit landing page still described the 30% rate when fetched on 29 Ju
  - The ROS extension to 18 November 2026 is conditional on both paying AND filing through ROS. Doing only one loses the extension entirely and the deadline reverts to 31 October 2026. The same all-or-nothing logic applies to the 23rd-of-month 
  - Large company preliminary corporation tax instalment dates. Revenue's web page states the 23rd of months six and eleven without distinguishing ROS from non-ROS filers. The underlying statutory day is understood to be the 21st, with the 23rd
  - The Return of Trading Details due date of the 23rd of the month following the accounting period end comes from Revenue TDM VAT-RTD-S76 and Revenue's calendar of key dates. The TDM PDF did not parse cleanly when fetched, so a partner should 

### Director's loan account memo

- **File:** `Memos/Director's loan account memo.pdf`
- **Category:** Memos · **Format:** PDF
- **Fact-check:** 54 figures verified, 0 critical and 3 major issues found and corrected
- **Open points for the reviewing partner:**
  - Cross-check against the firm's codebase figures: every 2026 figure I was asked to verify agrees with the official sources. Income tax at 20 and 40 per cent, standard rate cut-off points of €44,000, €53,000 and up to €35,000 for a second inc
  - One nuance on PRSI. The firm's note says 4.1 per cent in 2025 and 4.2 per cent from the start of 2026. The official position is that 4.2 per cent took effect on 1 October 2025, so 4.1 per cent applied only to the first nine months of 2025. 
  - The pension relief age bands, the €115,000 earnings cap, the 33 per cent CGT rate and the €1,270 annual exemption were not checked in this research because the memo does not rely on them. They should be verified separately if they appear in
  - The Class A employer PRSI rates and the €552 weekly threshold are the weakest link in the figures. Direct fetches of the gov.ie PRSI Class A Rates page, the SW14 2026 Contribution Rates and User Guide and the citizensinformation.ie PRSI pag
  - The specified rates for preferential loans are set by the Department of Finance and can be changed by any Finance Act. They were confirmed as 4 per cent and 13.5 per cent on the live Revenue page as at 29 July 2026 and were not changed by B
  - Only the income tax treatment of a section 439 write-off was confirmed from an official source. Revenue's manual establishes the Case IV Schedule D charge and the non-refundable standard rate credit. It does not address USC or PRSI on the d

### Small benefit exemption memo

- **File:** `Memos/Small benefit exemption memo.pdf`
- **Category:** Memos · **Format:** PDF
- **Fact-check:** 46 figures verified, 0 critical and 1 major issues found and corrected
- **Open points for the reviewing partner:**
  - The exemption is legislated to end. Section 112B(3), inserted by Finance Act 2024, provides that the section ceases to have effect for the year of assessment 2030 and later years. Any advice about multi-year reward planning should flag that
  - Budget 2027 is expected in October 2026, within months of this memo. The EUR 1,500 and five benefit figures are the confirmed 2026 position, but should be re-checked against the Budget 2027 announcement and the resulting Finance Act before 
  - Revenue Tax and Duty Manual Part 05-01-01e, the primary detailed source used here, is dated February 2025. It should be re-checked for a later revision before publication. The related manuals are more recent: Part 38-03-33 was updated Octob
  - The corporation tax deduction point rests on the general wholly and exclusively rule in section 81 TCA 1997, not on any small benefit exemption specific Revenue guidance. It is stated at medium confidence. It should be reviewed separately f
  - Revenue confirms that no income tax, USC or PRSI arises on a qualifying benefit. The statement in the memo that employer PRSI is also avoided follows from that treatment rather than from a separately sourced Department of Social Protection 
  - There is an internal inconsistency in Revenue's own guidance on whether a non-qualifying benefit must be reported under ERR. Paragraph 4 of TDM Part 05-01-01e states the reporting obligation applies where the exemption applies, but Example 

## Sourcing note

`irishstatutebook.ie` blocks automated access, so statutory references were
corroborated through Revenue's Tax and Duty Manuals rather than read directly
from the Acts. Open the statute links in a browser to confirm they resolve
before publication.

## Still to produce

Templates (11), Tax forms (4), VAT forms (3) and Setup guides (5) have not been
created yet. Their cards remain listed as "in preparation" on the site.
